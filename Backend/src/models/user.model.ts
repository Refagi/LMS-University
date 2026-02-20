import { Prisma } from '@/generated/prisma/client';
import prisma from '@/../prisma/client.js';

export type User = Prisma.UserGetPayload<{}>;
type Token = Prisma.TokenGetPayload<{}>;

export type BaseUserRegist = Pick<User, "email" | "role" >;

export interface RequestCreateUser extends BaseUserRegist {}

export interface UpdateUserEmailByAdmin {
    userId: string;
    newEmail: string;
}

export interface UpdateUserStatusAdmin {
    userId: string;
    status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
}