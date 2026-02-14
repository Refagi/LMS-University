import { Hono } from 'hono';

import adminRoute from './admin.route.js';

const app = new Hono();
app.route('/admin', adminRoute);

export default app;