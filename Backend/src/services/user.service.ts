import httpStatusCode from 'http-status-codes';
import prisma from '../../prisma/client.js';
import { ApiError } from '@/utils/ApiError.js';
import { Prisma } from '@/generated/prisma/client.js';
import { config } from '@/config/config.js';
import type { RequestCreateStudent } from '@/models/user.model.js';
import { id } from 'zod/v4/locales';
const password = "super-secure-pa$$word";


type User = Prisma.UserGetPayload<{}>;
type Token = Prisma.TokenGetPayload<{}>;

export class UserService {
  static async getUserByEmail(email: string) {
    const user: User | null = await prisma.user.findUnique({
      where: { email }  
    });
    
    if (!user) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'User not found');
    }
    return user;
  };

  static async getUserById(userId: string) {
    const user: User | null = await prisma.user.findUnique({
      where: {id: userId}
    });

    if (!user) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'User not found');
    }
    return user;
  }

  static async createStudent(userBody: RequestCreateStudent) {
    userBody.password = await Bun.password.hash(userBody.password, {
      algorithm: "bcrypt",
      cost: 10,
    });

    const { username, password, email } = userBody

    const student = await prisma.user.create({
      data: {
        username,
        password,
        email,
        role: 'MAHASISWA'
      }, 
    })
    return student;
  }
}