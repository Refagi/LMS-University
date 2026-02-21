import httpStatusCode from 'http-status-codes';
import prisma from '../../prisma/client.js';
import { ApiError } from '@/utils/ApiError.js';
import { Prisma } from '@/generated/prisma/client.js';
import { config } from '@/config/config.js';
import type { RequestCreateUser, UpdateUserStatusAdmin } from '@/models/user.model.js';
import { TokenServices, StudentServices, AuthServices, EmailServices } from './index';
import { TokenTypes } from '@/models/token.model.js';

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
      }
    });
    return user;
  }

  static async resetPasswordByAdmin (userId: string) {
    const user = await this.getUserById(userId);
    if(!user) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'User tidak ditemukan!');
    }
    const resetPasswordTokenDoc = await TokenServices.generateResetPasswordToken(user.email);
    return resetPasswordTokenDoc;
  }
};

export default AdminServices;