import { Prisma } from '@/generated/prisma/client';
import moment, { type Moment } from 'moment';
import { boolean } from 'zod';

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
  VERIFY_EMAIL = 'verifyEmail',
  UPDATE_EMAIL = 'updateEmail'
};

export type tokenTypes = 'access' | 'refresh'| 'resetPassword' |  'verifyEmail' | 'updateEmail';

export interface TypeSaveToken {
  token: string, 
  userId: string, 
  expires: Moment, 
  type: tokenTypes,
  newEmail?: string,
  blacklisted?: boolean
}
