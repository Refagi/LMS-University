import httpStatusCode from 'http-status-codes';
import { ApiError } from '@/utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { TokenServices, StudentServices, EmailServices,  AuthServices } from '@/services/index.js';
import { TokenTypes } from '@/models/token.model.js';
import { type  Context } from 'hono';
import { setCookie, getCookie, deleteCookie } from 'hono/cookie'
import type { LoginBody, LogoutBody, VerifyEmailBody, ActivateAccountBody, ForgotPasswordBody, ResetPasswordBody } from '@/validations/auth.validation.js';

class AuthController {
    static login = catchAsync(async (c: Context) => {
        const {email, password} = c.get('parsedJson') as LoginBody;
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

    static logout = catchAsync(async (c: Context) => {
        const getCookies = getCookie(c, 'refreshToken') as LogoutBody['refreshToken'];
        if (!getCookies) {
            throw new ApiError(httpStatusCode.NOT_FOUND, 'Kamu telah logout!');
        }
        await AuthServices.logout(getCookies);
        deleteCookie(c, 'accessToken', { path: '/v1' });
        deleteCookie(c, 'refreshToken', { path: '/v1' });
        return c.json({status: httpStatusCode.OK, message: 'Logout is successfully'});
    });

    static verifyEmail = catchAsync(async (c: Context) => {
        const { token } = c.get('parsedQuery') as VerifyEmailBody;
        await AuthServices.verifyEmail(token);
        return c.json({status: httpStatusCode.OK, message: 'Email berhasil diverifikasi'})
    })

    static activateAccount = catchAsync(async (c: Context) => {
        const { email, password } = c.get('parsedJson') as ActivateAccountBody;
        const updatedUser = await AuthServices.activateAccount(email, password);
        return c.json({status: httpStatusCode.OK, message: 'Password berhasil diatur dan email berhasil diverifikasi', data: updatedUser})
    });

    static refreshToken = catchAsync(async (c: Context) => {
        const getToken = getCookie(c, 'refreshToken') as LogoutBody['refreshToken'];
        if (!getToken) {
            throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Refresh token tidak ditemukan!');
        }
        const newToken = await AuthServices.refreshToken(getToken);
        setCookie(c, 'accessToken', newToken.access.token, {
            httpOnly: true,
            secure: Bun.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/v1',
            maxAge: 60 * 60 // 60 minutes
        });
        setCookie(c, 'refreshToken', newToken.refresh.token, {
            httpOnly: true,
            secure: Bun.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/v1',
            maxAge: 60 * 60 * 24 * 30 // 30 days
        });
        return c.json({status: httpStatusCode.OK, message: 'Token berhasil diperbarui', data: newToken});
    })

    static forgotPassword = catchAsync(async (c: Context) => {
        const { email } = c.get('parsedJson') as ForgotPasswordBody;
        const resetPasswordToken = await TokenServices.generateResetPasswordToken(email);
        await EmailServices.sendVerificationForgotPassword(email, resetPasswordToken);
        return c.json({status: httpStatusCode.OK, message: `Email reset password berhasil dikirim, silahkan cek ${email}!`})
    })

    static resetPassword = catchAsync(async (c: Context) => {
        const token = c.get('parsedQuery').token as VerifyEmailBody['token'];
        const { newPassword } = c.get('parsedJson') as ResetPasswordBody;
        await AuthServices.resetPassword(token, newPassword);
        return c.json({status: httpStatusCode.OK, message: 'Password berhasil direset!'})
    })


}

export default AuthController;
