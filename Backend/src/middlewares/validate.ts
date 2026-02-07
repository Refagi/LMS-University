import { ApiError } from '@/utils/ApiError';
import type { Context, Next } from 'hono';
import { ZodError, type ZodType } from 'zod';
import httpStatusCode from 'http-status-codes';
import { ValidationType } from '@/models/auth.model';

const parsers = {
  [ValidationType.BODY]: async (c: Context) => await c.req.parseBody(),
  [ValidationType.QUERY]: (c: Context) => c.req.query(),
  [ValidationType.PARAM]: (c: Context) => c.req.param(),
  [ValidationType.HEADER]: (c: Context) => c.req.header(),
  [ValidationType.JSON]: async (c: Context) => await c.req.json(),
};

export class ValidateMiddlewares {
    createValidator(schema: ZodType, type: ValidationType) {
        return async (c: Context, next: Next) => {
            try {
                const parser = parsers[type];
                const data = await parser(c);
                const validatedData = schema.parse(data);
                c.set('parsedData', validatedData);
                await next();
            } catch(error) {
                if (error instanceof SyntaxError) {
                    throw new ApiError(httpStatusCode.BAD_REQUEST, 'Invalid JSON format');
                } else if (error instanceof ZodError) {
                    throw new ApiError(httpStatusCode.BAD_REQUEST, error.issues.map(({ message }) => ({ message                                              })));
                } else {
                    throw error;
                }
            }
         }
    }
    
    validate = (schema: ZodType) => {
        return this.createValidator(schema, ValidationType.BODY);
    };
    
    validateQuery = (schema: ZodType) => {
        return this.createValidator(schema, ValidationType.QUERY);
    };
    
    validateJson = (schema: ZodType) => {
        return this.createValidator(schema, ValidationType.JSON);
    };
    
    validateParam = (schema: ZodType) => {
        return this.createValidator(schema, ValidationType.PARAM);
    };
    
    validateHeader = (schema: ZodType) => {
        return this.createValidator(schema, ValidationType.HEADER);
    };
}

export const validateMiddlewares = new ValidateMiddlewares();