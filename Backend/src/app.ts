import { Hono } from 'hono';
import { secureHeaders } from 'hono/secure-headers';
import { cors } from 'hono/cors';
import { compress } from 'hono/compress';
import { logger } from '@/config/logger';
import { loggerHandler } from '@/config/loggerHandler';
import { config } from '@/config/config';
import { ErrorHandlers, ErrorConverters, errorHandler } from '@/middlewares/error';

const app = new Hono();

if (config.env !== 'test') {
  app.use(loggerHandler)
}

app.use('*', secureHeaders({
    contentSecurityPolicy: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'"],
        scriptSrc: ["'self'"],
    },
    xFrameOptions: 'DENY',
    xContentTypeOptions: 'nosniff',
    referrerPolicy: 'strict-origin-when-cross-origin',
}));

app.use(
  '/v1/*',
  cors({
    origin: 'http://frontend:5000',
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use('/v1/*', compress({encoding: 'gzip'}));

app.get('/v1', (c) => {
  logger.info('Root endpoint accessed');
  return c.text('Hello Bun!')
});

app.onError(errorHandler);

app.notFound((c) => {
  return c.json({
    code: 404,
    message: 'Route not found'
  }, 404);
});

export default app;
