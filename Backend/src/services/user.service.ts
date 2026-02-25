import httpStatusCode from 'http-status-codes';
import prisma from '../../prisma/client.js';
import { ApiError } from '@/utils/ApiError.js';
import { Prisma, Role } from '@/generated/prisma/client.js';
import { config } from '@/config/config.js';
import type { UpdateUserEmailType } from '@/models/user.model.js';
import { AuthServices, AdminServices } from './index';
import { TokenTypes } from '@/models/token.model.js';

type User = Prisma.UserGetPayload<{}>;
type Token = Prisma.TokenGetPayload<{}>;

class UserService {
    static async updateUserEmail (userBody: UpdateUserEmailType) {
        const { userId, newEmail } = userBody;
        const getUser = await AdminServices.getUserById(userId);
        if(!getUser) {
            throw new ApiError(httpStatusCode.NOT_FOUND, 'User tidak ditemukan!');
        }

        const [updateUser] = await prisma.$transaction([
            prisma.user.update({
                where: {id: getUser.id},
                data: {email: newEmail, updatedAt: new Date()}
            }),
            prisma.token.deleteMany({
                where: {userId: getUser.id, type: TokenTypes.UPDATE_EMAIL},

            })
        ])
        return updateUser;
    }
  
};

export default UserService;