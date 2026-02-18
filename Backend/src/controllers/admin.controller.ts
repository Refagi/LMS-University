import httpStatusCode from 'http-status-codes';
import { ApiError } from '@/utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { TokenServices, StudentServices, EmailServices, AdminServices } from '@/services/index.js';
import { TokenTypes } from '@/models/token.model.js';
import type { User } from '@/models/student.model.js';
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
    const { email, role } = c.get('parsedData') as User;
    const user = await AdminServices.createUser({ email, role, password: null });

    const verifyTokenDoc = await TokenServices.generateVeryfyEmailToken(user);
    await EmailServices.sendVerification(user.email, verifyTokenDoc);

    return c.json({message: 'User berhasil dibuat!', status: httpStatusCode.CREATED, data: user})
  });
};

export default AdminController;