import { SignJWT, jwtVerify } from 'jose'
import moment, { type Moment } from 'moment';
import { config } from '@/config/config';
import { TokenTypes} from '@/models/token.model';
import { Prisma } from '@/generated/prisma/client';
import prisma from '@/../prisma/client.js';
import { ApiError } from '@/utils/ApiError';
import type { User, Token, JwtPayload } from '@/models/token.model';

export type tokenTypes = 'access' | 'refresh'| 'resetPassword' |  'verifyEmail'

export class TokenService {
  static async generateToken( userId: string, expires: Moment, type: tokenTypes, secret: string = config.jwt.secret): Promise<string> {
    const payload = { type };

    const encodedSecret = new TextEncoder().encode(secret);

    return new SignJWT( payload )
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(userId)
      .setIssuedAt()
      .setExpirationTime(expires.toDate())
      .sign(encodedSecret);
  }
}
