import { jwtVerify } from 'jose'
import httpStatusCode from 'http-status-codes';
import { ApiError } from '@/utils/ApiError';
import type { MiddlewareHandler } from "hono";
import { HTTPException } from 'hono/http-exception';
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { config } from '@/config/config';
import prisma from '../../prisma/client';


export const auth: MiddlewareHandler = async (c, next) => {
  try {
    const authHeader = c.req.header('Authorization');
    const cookiesToken = c.req.header('accessToken');

    let token = null;

    if (authHeader?.startsWith('Bearer ')) {
      token  = authHeader.slice(7);
    } else if(cookiesToken) {
      token = cookiesToken;
    }

    if(!token) {
      throw new HTTPException(httpStatusCode.UNAUTHORIZED as ContentfulStatusCode , {message: 'Please authenticate'})
    }
    const secret = new TextEncoder().encode(config.jwt.secret);
    const { payload } = await jwtVerify(token, secret);

    if (payload.type !== 'access') {
      throw new HTTPException(httpStatusCode.UNAUTHORIZED as ContentfulStatusCode, {message: 'Invalid token type'});
    }
    const user = await prisma.user.findUnique({where: {id: payload.sub}})

    if (!user) {
      throw new HTTPException(httpStatusCode.UNAUTHORIZED as ContentfulStatusCode , {message: 'Please authenticate'});
    }
    c.set('user', user);
    await next();

  } catch (err) {
      throw new HTTPException(httpStatusCode.UNAUTHORIZED as ContentfulStatusCode, {message: 'Invalid or expired token'});
  }
}
