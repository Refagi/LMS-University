import { Prisma } from '@/generated/prisma/client';
import prisma from '@/../prisma/client.js';

export type User = Prisma.UserGetPayload<{}>;
export type Token = Prisma.TokenGetPayload<{}>;

export interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
  type: string
}

export enum TokenTypes {
  ACCESS = 'access',
  REFRESH = 'refresh',
  RESET_PASSWORD  = 'resetPassword',
  VERIFY_EMAIL = 'verifyEmail'
};