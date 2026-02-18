import httpStatusCode from 'http-status-codes';
import prisma from '../../prisma/client.js';
import { ApiError } from '@/utils/ApiError.js';
import { Prisma, Role } from '@/generated/prisma/client.js';
import { config } from '@/config/config.js';
import type { RequestCreateStudent,RequestUpdateStudent } from '@/models/student.model.js';
import { TokenServices, StudentServices, AuthServices } from './index';
import { TokenTypes } from '@/models/token.model.js';


type User = Prisma.UserGetPayload<{}>;
type Token = Prisma.TokenGetPayload<{}>;

class StudentService {

  
};

export default StudentService;