import { Hono } from 'hono';
import { secureHeaders } from 'hono/secure-headers';
import { cors } from 'hono/cors';
import { compress } from 'hono/compress';
import { logger } from './config/logger';
import { logger as honoLogger } from "hono/logger";

const app = new Hono();

app.use("*", honoLogger());

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

app.get('/', (c) => {
  logger.info('Root endpoint accessed');
  return c.text('Hello Bun!')
});

export default app;
