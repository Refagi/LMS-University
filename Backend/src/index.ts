import { Hono } from 'hono';
import { secureHeaders } from 'hono/secure-headers';

const app = new Hono();

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

app.get('/', c => c.text('Hello Bun!'));

export default app;
