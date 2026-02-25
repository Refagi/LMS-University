import httpStatusCode from 'http-status-codes';
import { ApiError } from '@/utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { TokenServices, StudentServices, EmailServices, AdminServices } from '@/services/index.js';
import { TokenTypes } from '@/models/token.model.js';
import { type  Context } from 'hono'
import type { ParamsId, CreateUserBody, UpdateUserStatusBody, GetAllUsersQuery } from '@/validations/admin.validation.js';
import type {  User } from '@/models/user.model.js';

class AdminController {
  static getUser = catchAsync(async (c: Context) => {
    const { userId } = c.get('parsedParam') as ParamsId;
    const user = await AdminServices.getUserById(userId)
    if(!user) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'User tidak ditemukan!');
    }

    return c.json({status: httpStatusCode.OK, data: user})
  });

  static getAllUser = catchAsync(async (c: Context) => {
    const options = c.get('parsedQuery') as GetAllUsersQuery;
    const users = await AdminServices.getAllUsers(options);
    return c.json({status: httpStatusCode.OK, ...users})
  })

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

  static resetPasswordByAdmin = catchAsync(async (c: Context) => {
    const { userId } = c.get('parsedParam') as ParamsId;
    const checkUser = c.get('user') as User
    if(!checkUser) {
      throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Pengguna belum terverifikasi!')
    }
    const { user, password } = await AdminServices.resetPasswordByAdmin(userId);
    await EmailServices.sendVerificationResetPassword(user.email, password);
    return c.json({status: httpStatusCode.OK, message: `Password berhasil direset. Email dengan password sementara telah dikirim, periksa ${user.email}`})
  })


};

export default AdminController;