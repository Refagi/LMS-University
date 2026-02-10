import { Prisma } from '@/generated/prisma/client';
import prisma from '@/../prisma/client.js';

type User = Prisma.UserGetPayload<{}>;
type Token = Prisma.TokenGetPayload<{}>;

export type BaseStudentRegist = Pick<User, "username" | "email" | "password" >;

export interface RequestCreateStudent extends BaseStudentRegist {}

