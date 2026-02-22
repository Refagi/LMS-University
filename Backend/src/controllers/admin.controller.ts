import httpStatusCode from 'http-status-codes';
import { ApiError } from '@/utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { TokenServices, StudentServices, EmailServices, AdminServices } from '@/services/index.js';
import { TokenTypes } from '@/models/token.model.js';
import { type  Context } from 'hono'
import type { ParamsId, CreateUserBody, UpdateUserStatusBody } from '@/validations/admin.validation.js';

class AdminController {
  static getUsers = catchAsync(async (c: Context) => {
    const { userId } = c.get('parsedParam') as ParamsId;
    const user = await AdminServices.getUserById(userId)
    if(!user) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'User tidak ditemukan!');
    }

    return c.json({status: httpStatusCode.OK, data: user})
  });

  static createUser = catchAsync(async (c: Context) => {
    const { email, role } = c.get('parsedJson') as CreateUserBody;
    const loggedInUser = c.get('user');

    if (loggedInUser.role === 'ADMIN' && role === 'ADMIN') {
      throw new ApiError(403, 'Admin tidak bisa membuat admin lain');
    }

    const existingEmail = await AdminServices.getUserByEmail(email);
    if(existingEmail) {
      throw new ApiError(httpStatusCode.BAD_REQUEST, 'Email sudah terdaftar!');
    }
    const user = await AdminServices.createUser({ email, role });

    const verifyTokenDoc = await TokenServices.generateVeryfyEmailToken(user);
    await EmailServices.sendVerificationEmail(user.email, verifyTokenDoc);

    const { password, ...safeUser } = user;

    return c.json({message: 'User berhasil dibuat!', status: httpStatusCode.CREATED, data: safeUser})
  });


  static updateUserStatusByAdmin = catchAsync(async (c: Context) => {
    const { status } = c.get('parsedJson') as UpdateUserStatusBody;
    const { userId } = c.get('parsedParam') as ParamsId;
    const updateUser = await AdminServices.updateUserStatusByAdmin({ userId, status });
    if (!updateUser) {
      throw new ApiError(httpStatusCode.BAD_REQUEST, 'Gagal memperbarui status user!');
    }
    return c.json({status: httpStatusCode.OK, message: 'Status berhasil diperbarui!', data: updateUser});
  });
};

export default AdminController;