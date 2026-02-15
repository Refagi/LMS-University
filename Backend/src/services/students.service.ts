import httpStatusCode from 'http-status-codes';
import prisma from '../../prisma/client.js';
import { ApiError } from '@/utils/ApiError.js';
import { Prisma, Role } from '@/generated/prisma/client.js';
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

  static async getStudentById(userId: string) {
    const user: User | null = await prisma.user.findUnique({
      where: {id: userId, role: 'MAHASISWA'}
    });

    if (!user) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'Mahasiswa tidak ditemukan');
    }
    return user;
  }

  static async createUser(userBody: RequestCreateStudent) {

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

  
};

export default StudentService;