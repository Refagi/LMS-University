import { Hono } from 'hono';

import adminRoute from './admin.route.js';
import authRoute from './auth.route.js';
import userRoute from './user.route.js';

const app = new Hono();
app.route('/auth', authRoute);
app.route('/admin', adminRoute);
app.route('/user', userRoute);

export default app;