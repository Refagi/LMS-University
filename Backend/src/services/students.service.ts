import httpStatusCode from 'http-status-codes';
import prisma from '../../prisma/client.js';
import { ApiError } from '@/utils/ApiError.js';
import { Prisma } from '@/generated/prisma/client.js';
import { config } from '@/config/config.js';
import type { RequestCreateStudent,RequestUpdateStudent } from '@/models/student.model.js';
import { TokenServices, StudentServices, AuthServices } from './index';
import { TokenTypes } from '@/models/token.model.js';


type User = Prisma.UserGetPayload<{}>;
type Token = Prisma.TokenGetPayload<{}>;

class StudentService {
  static async getUserByEmail(email: string) {
    const user: User | null = await prisma.user.findUnique({
      where: { email }  
    });
    
    if (!user) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'Mahasiswa tidak ditemukan');
    }
    return user;
  };

  static async getUserById(userId: string) {
    const user: User | null = await prisma.user.findUnique({
      where: {id: userId}
    });

    if (!user) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'Mahasiswa tidak ditemukan');
    }
    return user;
  }

  static async createStudent(userBody: RequestCreateStudent) {

    const { email } = userBody

    const student = await prisma.user.create({
      data: {
        email,
        status: 'PENDING',
        password: null,
        role: 'MAHASISWA'
      }, 
    })
    return student;
  }

  static async setStudentPasswordandVerifyEmail(token: string, password: string) {
    const verifyEmailTokenDoc = await TokenServices.verifyToken(token, TokenTypes.VERIFY_EMAIL);
    const user = await this.getUserById(verifyEmailTokenDoc.userId);
    if (user.password) {
      throw new ApiError(httpStatusCode.BAD_REQUEST, 'Password sudah diatur sebelumnya!');
    }
    const hashedPassword = await Bun.password.hash(password, {
      algorithm: 'bcrypt',
      cost: 10
    })

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          isEmailVerified: true,
          status: 'ACTIVE',
          updatedAt: new Date()
        }
      }),
      prisma.token.deleteMany({
        where: { userId: user.id, type: TokenTypes.VERIFY_EMAIL }
      })
    ]);
  }
}

export default StudentService;