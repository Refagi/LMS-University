import { Prisma } from '@/generated/prisma/client';

export type User = Prisma.UserGetPayload<{}>;

export type BaseUserRegist = Pick<User, "email" | "role" >;

export interface RequestCreateUser extends BaseUserRegist {}

export interface UpdateUserStatusAdmin {
    userId: string;
    status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
}

export interface GetAllUsers {
    page?: number;
    limit?: number;
    search?: string;
    role?: 'ADMIN' | 'DOSEN' | 'MAHASISWA';
    status?: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
    faculty?: string;
    studyProgram?: string;
    isEmailVerified?: boolean;
    sortBy?: 'email' | 'fullName' | 'role' | 'status';
    sortOrder?: 'asc' | 'desc';
}

export interface UpdateUserEmailType {
    userId: string;
    newEmail: string;
} 