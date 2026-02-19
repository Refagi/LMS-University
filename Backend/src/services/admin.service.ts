import httpStatusCode from 'http-status-codes';
import prisma from '../../prisma/client.js';
import { ApiError } from '@/utils/ApiError.js';
import { Prisma } from '@/generated/prisma/client.js';
import { config } from '@/config/config.js';
import type { RequestCreateUser } from '@/models/user.model.js';
import { TokenServices, StudentServices, AuthServices } from './index';
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
};

export default AdminServices;