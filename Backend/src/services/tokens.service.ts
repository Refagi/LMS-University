import { SignJWT, jwtVerify } from 'jose'
import moment, { type Moment } from 'moment';
import { config } from '@/config/config';
import { TokenTypes} from '@/models/token.model';
import { Prisma } from '@/generated/prisma/client';
import prisma from '@/../prisma/client.js';
import { ApiError } from '@/utils/ApiError';
import type { User, Token, JwtPayload } from '@/models/token.model';
import httpStatusCode from 'http-status-codes';
import { StudentServices } from './index';

type tokenTypes = 'access' | 'refresh'| 'resetPassword' |  'verifyEmail'

class TokenService {
  static async generateToken ( userId: string, expires: Moment, type: tokenTypes, secret: string = config.jwt.secret): Promise<string> {
    const payload = { type };
    const encodedSecret = new TextEncoder().encode(secret);

    return new SignJWT( payload )
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(userId)
      .setIssuedAt()
      .setExpirationTime(expires.toDate())
      .sign(encodedSecret);
  }

  static async saveToken (token: string, userId: string, expires: Moment, type: tokenTypes, blacklisted = false): Promise<Token> {
      const tokenDoc: Token = await prisma.token.create({
        data: {
            token,
            userId: userId,
            expires: expires instanceof Date ? expires : expires.toDate(),
            type,
            blacklisted
        }})
        return tokenDoc;
  }

  static async verifyToken (token: string, type: string) {
    try {
      const encodedSecret = new TextEncoder().encode(config.jwt.secret);
      const payload = (await jwtVerify(token, encodedSecret)).payload;
      const tokenDoc = await prisma.token.findFirst({
        where: {
          token,
          type,
          userId: payload.sub,
          blacklisted: false
        }
      });
      if (!tokenDoc) {
        throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Token not found!');
      }
      return tokenDoc;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Token is invalid!';
      throw new ApiError(httpStatusCode.UNAUTHORIZED, message);
    }
  }

  static async generateAuthTokens(userId: string) {
    const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = await this.generateToken(userId, accessTokenExpires, TokenTypes.ACCESS);
    
    const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = await this.generateToken(userId, refreshTokenExpires, TokenTypes.REFRESH);
    
    await this.saveToken(refreshToken, userId, refreshTokenExpires, TokenTypes.REFRESH);
    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate()
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.toDate()
      }
    }
  }

  static async generateVeryfyEmailToken(users: User) {
    const userId = users.id;
    if (!userId) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'User is not found');
    }
    await prisma.token.deleteMany({
      where: {
        userId,
        type: TokenTypes.VERIFY_EMAIL
      }
    });

    const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
    const verifyEmailToken = await this.generateToken(userId, expires, TokenTypes.VERIFY_EMAIL);
    await this.saveToken(verifyEmailToken, userId, expires, TokenTypes.VERIFY_EMAIL);
    return verifyEmailToken;
  }

  static async generateResetPasswordToken(email: string) {
    const user = await StudentServices.getUserByEmail(email);
      await prisma.token.deleteMany({
        where: {
          userId: user.id,
          type: TokenTypes.RESET_PASSWORD
        }
      });
      
      const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
      const resetPasswordToken = await this.generateToken(user.id, expires, TokenTypes.RESET_PASSWORD);
      await this.saveToken(resetPasswordToken, user.id, expires, TokenTypes.RESET_PASSWORD);
      return resetPasswordToken;
  }

}

export default TokenService;