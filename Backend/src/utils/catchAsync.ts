import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { errorConverter } from "../middlewares/error.js";
import { ApiError } from "./ApiError";
import type { ContentfulStatusCode } from "hono/utils/http-status";


type AsyncHandler = (c: Context, next?: Next) => Promise<Response>;

export const catchAsync = (fn: AsyncHandler) => {
  return async (c: Context, next: Next) => {
    try {
      return await fn(c, next);
    } catch (error: any) {
        const convertedError = errorConverter(error);
        throw new HTTPException(convertedError.statusCode as ContentfulStatusCode, { message: convertedError.message })
      }

  };
};
