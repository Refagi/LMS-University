import httpStatusCode from 'http-status-codes';
import prisma from '../../prisma/client.js';
import { ApiError } from '@/utils/ApiError.js';
import { Prisma } from '@/generated/prisma/client.js';
import { config } from '@/config/config.js';
import type { RequestCreateUser, UpdateUserStatusAdmin, GetAllUsers } from '@/models/user.model.js';
import { TokenServices, StudentServices, AuthServices, EmailServices } from './index';
import { generateRandomPassword } from '@/utils/randomPass.js';

type User = Prisma.UserGetPayload<{}>;

class AdminServices {
  static async getUserByEmail(email: string) {
    const user: User | null = await prisma.user.findUnique({
      where: { email }  
    });
    return user;
  };

  static async getUserById(userId: string) {
    const user: User | null = await prisma.user.findUnique({
      where: {id: userId}
    });
    return user;
  }

  static async getAllUsers(options: GetAllUsers) {
    const { page = 1, limit = 10, search, role, status, faculty, studyProgram, sortBy = 'fullName', sortOrder } = options;
    const skip = (page - 1) * limit;
    const where: Prisma.UserWhereInput = {
      ...(role && { role }),
      ...(status && { status }),

      ...(search && {
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          {
            profile: {
              OR: [
                { fullName: { contains: search, mode: 'insensitive' } },
                { npm: { contains: search, mode: 'insensitive' } },
                { nidn: { contains: search, mode: 'insensitive' } },
              ]
            }
          }
        ]
      }),
      ...(faculty &&  {profile: {faculty: { contains: faculty, mode: 'insensitive' }}}),
      ...(studyProgram &&  {profile: {StudyProgram: { contains: studyProgram, mode: 'insensitive' }}}),
    }

    let orderBy: Prisma.UserOrderByWithRelationInput;
    if (sortBy === 'fullName') {
      orderBy = {
        profile: {
          fullName: sortOrder
        }
      };
    } else {
      orderBy = {
        [sortBy]: sortOrder
      };
    }
    
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          profile: {
            select: {
              fullName: true,
              phone: true,
              npm: true,
              nidn: true,
              faculty: true,
              StudyProgram: true,
              image: true,
              generation: true
            }
          },
          _count: {
            select: {
              enrollments: true,
              courses: true,
            }
          }
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.user.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const nextPage = page < totalPages;
    const prevPage = page > 1;

    return {
      data: users.map(user => ({
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        profile: user.profile,
        stats: {
          enrollments: user._count.enrollments,
          courses: user._count.courses,
        }
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        nextPage,
        prevPage,
      }
    };
  }

  static async createUser(userBody: RequestCreateUser) {

    const { email, role } = userBody

    const student = await prisma.user.create({
      data: {
        email,
        status: 'PENDING',
        password: null,
        role
      }, 
    })
    return student;
  }

  static async updateUserStatusByAdmin (userBody: UpdateUserStatusAdmin) {
    const { userId, status } = userBody;
    const getUser = await this.getUserById(userId);
    if(!getUser) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'User tidak ditemukan!');
    }
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        status,
        updatedAt: new Date()
      }
    });
    return user;
  }

  static async resetPasswordByAdmin (userId: string) {
    const user = await this.getUserById(userId);
    if(!user) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'User tidak ditemukan!');
    }
    if(user.status !== 'ACTIVE') {
      throw new ApiError(httpStatusCode.BAD_REQUEST, 'User tidak aktif!');
    }
    if(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      throw new ApiError(httpStatusCode.FORBIDDEN, 'Tidak dapat mereset password untuk admin!');
    }
    const temporaryPassword = generateRandomPassword(12);
    const hashedPassword = await Bun.password.hash(temporaryPassword, {
      algorithm: 'bcrypt',
      cost: 10
    })
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        updatedAt: new Date()
      }
    })
    const { password, ...userWithoutPassword } = updatedUser;
    return { user: userWithoutPassword, password: temporaryPassword };
  }
};

export default AdminServices;