import httpStatusCode from 'http-status-codes';
import { ApiError } from '@/utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';
import {  UserService, TokenServices, EmailServices, AdminServices } from '@/services/index.js';
import { TokenTypes } from '@/models/token.model.js';
import type {  User, UpdateUserEmail } from '@/models/user.model.js';
import { type  Context } from 'hono'

class UserController {

    static requestUpdateEmail = catchAsync(async (c: Context) => {
        const user = c.get('user') as User
        if(!user) {
            throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Pengguna belum terverifikasi!')
        }
        const { newEmail } = c.get('parsedData') as {newEmail: string}
        const existingUser = await AdminServices.getUserByEmail(newEmail)
        if (existingUser) {
            throw new ApiError(httpStatusCode.BAD_REQUEST, 'Email sudah digunakan!')
        }
        const verifyToken = await TokenServices.generateUpdateEmail(user.id, newEmail)
        await EmailServices.sendVerificationUpdateEmail(newEmail, verifyToken)
        return c.json({status: httpStatusCode.OK, message: `Verifikasi update email telah dikirim, periksa ${newEmail}`, token: verifyToken})
    })

    static verifyUpdateEmail = catchAsync(async (c: Context) => {
        const token = c.req.query('token')
        
        if (!token) {
            throw new ApiError(httpStatusCode.BAD_REQUEST, 'Token required!')
        }

        const tokenDoc = await TokenServices.verifyToken(token, TokenTypes.UPDATE_EMAIL)
        if(!tokenDoc.newEmail) {
            throw new ApiError(httpStatusCode.BAD_REQUEST, 'Email baru belum dibuat!');
        }

        const updateUser = await UserService.updateUserEmail(tokenDoc.userId, tokenDoc.newEmail);
        if (!updateUser) {
            throw new ApiError(httpStatusCode.BAD_REQUEST, 'Gagal memperbarui email user!'); 
        }
        return c.json({status: httpStatusCode.OK, message: 'Email berhasil diperbarui!', data: updateUser})
    });
}

export default UserController