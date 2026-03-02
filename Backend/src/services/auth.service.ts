import { TokenServices, StudentServices, AdminServices } from './index';
import { ApiError } from '@/utils/ApiError';
import httpStatusCode from 'http-status-codes';
import prisma from '@/../prisma/client';
import { TokenTypes } from '@/models/token.model';
import type { LoginType, ActivateUserType, ResetPasswordType } from '@/models/auth.model';

export class AuthServices {
    static async login(userBody: LoginType) {
        const { email, password } = userBody;
        const user = await prisma.user.findUnique({
            where: {email}
        })

        if (!user) {
            throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Email atau Password salah!');
        }

        if(user.status === 'SUSPENDED') {
            throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Akun anda disuspend, silahkan hubungi admin untuk mengaktifkan akun anda!');
        }
        
        
        if (user.isEmailVerified === false) {
            throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Email anda belum ter-vifikasi!');
        }
        
        if(user.status !== 'ACTIVE') {
            throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Akun anda belum aktif, silahkan hubungi admin untuk mengaktifkan akun anda!');
        }

        if (!user.password) {
            throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Password belum diatur, silahkan atur password terlebih dahulu!');
        }
        
        const validPassword = await Bun.password.verify(password, user.password);
        
        if (!validPassword) {
            throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Email atau Password salah!');
        }
        const existingLoginUser = await prisma.token.findFirst({
            where: { userId: user.id, type: 'REFRESH' },
            orderBy: { createdAt: 'desc' },
        });
        
        if (existingLoginUser) {
            await prisma.token.delete({
                where: {
                    id: existingLoginUser.id,
                },
            });
        }
        
        return user;
    }

    static async logout(refreshToken: string) {
        const getRefreshToken = await prisma.token.findFirst({
            where: { token: refreshToken, type: 'REFRESH', blacklisted: false }
        });
        
        if (!getRefreshToken) {
            throw new ApiError(httpStatusCode.NOT_FOUND, 'Kamu telah logout!');
        }
        await prisma.token.delete({ where: { id: getRefreshToken.id } });
    };

    static async refreshToken (tokens: string) {
        try {
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
    
    static async verifyEmail (token: string) {
        const verifyEmailTokenDoc = await TokenServices.verifyToken(token, TokenTypes.VERIFY_EMAIL);
        if (!verifyEmailTokenDoc) {
            throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Invalid Token!');
        }
        
        const getUser = await AdminServices.getUserById(verifyEmailTokenDoc.userId);
        if(!getUser) {
            throw new ApiError(httpStatusCode.NOT_FOUND, 'Pengguna tidak ditemukan!');
        }
        
        await prisma.$transaction([
            prisma.user.update({
                where: { id: verifyEmailTokenDoc.userId },
                data: { isEmailVerified: true }
            }),
            
            prisma.token.deleteMany({
                where: {
                    userId: getUser.id,
                    type: 'VERIFY_EMAIL'
                }
            })
        ]);
    };

    static async activateAccount(userBody: ActivateUserType) {
        const { email, password } = userBody;
        const user = await AdminServices.getUserByEmail(email);
        if(!user) {
          throw new ApiError(httpStatusCode.NOT_FOUND, 'Pengguna tidak ditemukan!');
        }
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
            prisma.token.deleteMany({where: { userId: user.id, type: 'VERIFY_EMAIL' }})
        ]);
    }

    static async resetPassword(userBody: ResetPasswordType) {
        try {
            const { token, newPassword } = userBody;
            const resetPasswordTokenDoc = await TokenServices.verifyToken(token, TokenTypes.RESET_PASSWORD);
            const user = await AdminServices.getUserById(resetPasswordTokenDoc.userId);
            if(!user) {
                throw new ApiError(httpStatusCode.NOT_FOUND, 'Pengguna tidak ditemukan!');
            }
            const hashedPassword = await Bun.password.hash(newPassword, {
                algorithm: 'bcrypt',
                cost: 10
            })
            const updatePassword = await prisma.$transaction([
                prisma.user.update({
                    where: { id: user.id }, data: { password: hashedPassword}
                }),
                prisma.token.deleteMany({
                    where: { userId: user.id, type: 'RESET_PASSWORD' }
                })
            ])
            return updatePassword;
        } catch (error)  {
            throw error
        }
    }
}

export default AuthServices;