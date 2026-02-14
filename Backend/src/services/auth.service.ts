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
            throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Email atau Password salah!');
        }
        return user;
    }

    static async refreshToken (tokens: string) {
        try {
            console.log('refresh console: ', tokens)
            const refreshTokenDoc = await TokenServices.verifyToken(tokens, TokenTypes.REFRESH);
            
            if (!refreshTokenDoc) {
                throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Token tidak valid!');
            }
            
            await prisma.token.delete({where: { id: refreshTokenDoc.id }});

            const newToken = await TokenServices.generateAuthTokens(refreshTokenDoc.userId);
            return newToken;
        } catch (error) {
            throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Silahkan lakukan verifikasi!');
        }
    };

    static async setStudentPasswordandVerifyEmail(token: string, password: string) {
        const verifyEmailTokenDoc = await TokenServices.verifyToken(token, TokenTypes.VERIFY_EMAIL);
        const user = await StudentServices.getStudentById(verifyEmailTokenDoc.userId);
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
                }}),
                prisma.token.deleteMany({where: { userId: user.id, type: TokenTypes.VERIFY_EMAIL }
                })
            ]);
    }
}

export default AuthServices;