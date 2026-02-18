import httpStatusCode from 'http-status-codes';
import { ApiError } from '@/utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { TokenServices, StudentServices, EmailServices,  AuthServices } from '@/services/index.js';
import { TokenTypes } from '@/models/token.model.js';
import type { User } from '@/models/student.model.js';
import { type  Context } from 'hono';
import { setCookie } from 'hono/cookie'


class AuthController {
    static login = catchAsync(async (c: Context) => {
        const {email, password} = c.get('parsedData') as User;
        if(!password ) {
            throw new ApiError(httpStatusCode.BAD_REQUEST, 'Password belum diatur, silahkan atur password terlebih dahulu!');
        }
        const user = await AuthServices.login(email, password);
        const tokens = await TokenServices.generateAuthTokens(user.id);
        setCookie(c, 'accessToken', tokens.access.token, {
            httpOnly: true,
            secure: Bun.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/v1',
            maxAge: 60 * 60 // 60 minutes
        });
        setCookie(c, 'refreshToken', tokens.refresh.token, {
            httpOnly: true,
            secure: Bun.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/v1',
            maxAge: 60 * 60 * 24 * 30 // 30 days
        });
        const { password: _, ...userWithoutPassword } = user;

        return c.json({status: httpStatusCode.OK, message: 'Login is successfully', data: { user: userWithoutPassword, tokens }})
    });

    static activateAccount = catchAsync(async (c: Context) => {
        const { token, password } = c.get('parsedData') as { token: string, password: string };
        const updatedUser = await AuthServices.activateAccount(token, password);
        return c.json({status: httpStatusCode.OK, message: 'Password berhasil diatur dan email berhasil diverifikasi', data: updatedUser})
    });


}

export default AuthController;
