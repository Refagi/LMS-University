import { Prisma } from '@/generated/prisma/client';
import prisma from '@/../prisma/client.js';

export type User = Prisma.UserGetPayload<{}>;
type Token = Prisma.TokenGetPayload<{}>;

export type BaseStudentRegist = Pick<User, "email" | "password"  | "role" >;

export interface RequestCreateStudent extends BaseStudentRegist {}

export type RequestUpdateStudent = Partial< Omit<User, 'id' | 'createdAt' | 'updatedAt'>> & {updatedAt?: Date;};