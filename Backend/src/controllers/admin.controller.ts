import httpStatusCode from 'http-status-codes';
import { ApiError } from '@/utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { TokenServices, StudentServices, EmailServices } from '@/services/index.js';
import { TokenTypes } from '@/models/token.model.js';
import type { User } from '@/models/student.model.js';
import { type  Context, Hono } from 'hono'
import { createStudent } from '@/validations/student.validation.js';

class StudentController {
  static getUsers = catchAsync(async (c: Context) => {
    const { id } = c.get('parsedData') as User;
    const user = await StudentServices.getStudentById(id)

    return c.json({status: httpStatusCode.OK, data: user})
  });

  static createUser = catchAsync(async (c: Context) => {
    const { email, status, role } = c.get('parsedData') as User;
    const user = await StudentServices.createUser({ email, status, role, password: null });
    return c.json({message: 'User berhasil dibuat!', status: httpStatusCode.CREATED, data: user})
  })
};

export default StudentController;