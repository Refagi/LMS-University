import { TokenServices, StudentServices } from './index';
import { ApiError } from '@/utils/ApiError';
import httpStatusCode from 'http-status-codes';
import prisma from '@/../prisma/client';
import { TokenTypes } from '@/models/token.model';

export class AuthServices {
    static async login(email: string, password: string) {
        const user = await prisma.user.findUnique({
            where: {email}
        })

        if (!user) {
            throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Email atau Password salah!');
        }
        
        
        if (user.isEmailVerified === false) {
            throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Email anda belum ter-vifikasi!');
        }
        
        if (!user.password) {
            throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Password belum diatur, silahkan atur password terlebih dahulu!');
        }
        
        const validPassword = await Bun.password.verify(password, user.password);
        
        if (!validPassword) {
            throw new ApiError(httpStatusCode.UNAUTHORIZED, 'wrong email or password!');
        }
        return user;
    }
}

export default AuthServices;