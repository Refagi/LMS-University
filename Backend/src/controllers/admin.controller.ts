import httpStatusCode from 'http-status-codes';
import { ApiError } from '@/utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { TokenServices, StudentServices, EmailServices, AdminServices } from '@/services/index.js';
import { TokenTypes } from '@/models/token.model.js';
import type { RequestCreateUser, User, UpdateUserEmailByAdmin, UpdateUserStatusAdmin } from '@/models/user.model.js';
import { type  Context } from 'hono'

class AdminController {
  static getUsers = catchAsync(async (c: Context) => {
    const { id } = c.get('parsedData') as User;
    const user = await AdminServices.getUserById(id)
    if(!user) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'User tidak ditemukan!');
    }

    return c.json({status: httpStatusCode.OK, data: user})
  });

  static createUser = catchAsync(async (c: Context) => {
    const { email, role } = c.get('parsedData') as RequestCreateUser;
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

  static updateUserEmailByAdmin = catchAsync(async (c: Context) => {
    const { userId, newEmail } = c.get('parsedData') as UpdateUserEmailByAdmin;
    const updateUser = await AdminServices.updateUserEmailByAdmin({ userId, newEmail });
    if (!updateUser) {
     throw new ApiError(httpStatusCode.BAD_REQUEST, 'Gagal memperbarui email user!'); 
    }
    return c.json({status: httpStatusCode.OK, message: 'Email berhasil diperbarui!', data: updateUser})
  });

  static updateUserStatusByAdmin = catchAsync(async (c: Context) => {
    const { userId, status } = c.get('parsedData') as UpdateUserStatusAdmin;
    const updateUser = await AdminServices.updateUserStatusByAdmin({ userId, status });
    if (!updateUser) {
      throw new ApiError(httpStatusCode.BAD_REQUEST, 'Gagal memperbarui status user!');
    }
    return c.json({status: httpStatusCode.OK, message: 'Status berhasil diperbarui!', data: updateUser});
  });
};

export default AdminController;