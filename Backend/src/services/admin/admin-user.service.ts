import httpStatusCode from 'http-status-codes';
import prisma from '@/../prisma/client.js';
import { ApiError } from '@/utils/ApiError.js';
import { Prisma } from '@/generated/prisma/client.js';
import type { RequestCreateUser, UpdateUserStatusAdmin, GetAllUsers } from '@/models/user.model.js';
import { generateRandomPassword } from '@/utils/randomPass.js';

type User = Prisma.UserGetPayload<{}>;

class AdminUserServices {
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
    const { page = 1, limit = 10, search, role, status, faculty, studyProgram, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;
    const where: Prisma.UserWhereInput = {
      ...(role && { role }),
      ...(status && { status }),
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        {
        Profile: {
          is: {
            OR: [
              { fullName: { contains: search, mode: 'insensitive' as const } },
              { npm: { contains: search, mode: 'insensitive' as const } },
              { nidn: { contains: search, mode: 'insensitive' as const } },
              { nip: { contains: search, mode: 'insensitive' as const } },
            ]
          }
        }
      }
      ]
    }

    const profileConditions: any[] = [];

    if (faculty) {
      profileConditions.push({
        StudyProgram: {
          is: {
            Faculty: { 
              is: { name: { contains: faculty, mode: 'insensitive' as const }}
            }
          }
        }
      })
    }

    if (studyProgram) {
      profileConditions.push({
        StudyProgram: {
          is: {
            name: { contains: studyProgram, mode: 'insensitive' as const }
          }
        }
      })
    }

    if(profileConditions.length > 0) {
      where.Profile = {
        is: {
          AND: profileConditions
        }
      }
    }

    let orderBy: Prisma.UserOrderByWithRelationInput;
    if (sortBy === 'fullName') {
      orderBy = {
        Profile: {
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
          Profile: {
            include: {
              StudyProgram: {
                include: {
                  Faculty: true
                }
              }
            }
          },
          _count: {
            select: {
              Enrollment: true,
              Course: true,
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
        profile: user.Profile ? {
          fullName: user.Profile.fullName,
          phone: user.Profile.phone,
          npm: user.Profile.npm,
          nidn: user.Profile.nidn,
          nip: user.Profile.nip,
          image: user.Profile.image,
          generation: user.Profile.generation,
          address: user.Profile.address,
          city: user.Profile.city,
          province: user.Profile.province,
          studyProgram: user.Profile.StudyProgram ? {
            name: user.Profile.StudyProgram.name,
            code: user.Profile.StudyProgram.code,
            degree: user.Profile.StudyProgram.degree,
            faculty: user.Profile.StudyProgram.Faculty ? {
              name: user.Profile.StudyProgram.Faculty.name,
              code: user.Profile.StudyProgram.Faculty.code,
            } : null
          } : null
        } : null,
        stats: {
          enrollments: user._count.Enrollment,
          courses: user._count.Course,
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
      throw new ApiError(httpStatusCode.NOT_FOUND, 'Pengguna tidak ditemukan!');
    }
    if(user.status !== 'ACTIVE') {
      throw new ApiError(httpStatusCode.BAD_REQUEST, 'Pengguna tidak aktif!');
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

  static async deleteUserByAdmin(userId: string) {
    const user = await this.getUserById(userId);
    if(!user) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'Pengguna tidak ditemukan!');
    }
    if(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      throw new ApiError(httpStatusCode.FORBIDDEN, 'Tidak dapat menghapus admin!');
    }
    await prisma.user.delete({
      where: { id: userId }
    })
  }
};

export default AdminUserServices;