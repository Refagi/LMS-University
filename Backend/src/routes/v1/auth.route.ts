import { Hono } from "hono";
import { AuthController } from "@/controllers/index.js";
import { auth } from "@/middlewares/auth";
import { validateMiddlewares } from "@/middlewares/validate.js";
import { login, verifyEmail, resetPassword, forgotPassord  } from "@/validations/auth.validation";

const authRoute = new Hono();

authRoute.post('/login', validateMiddlewares.validateJson(login), AuthController.login);
authRoute.post('/logout', AuthController.logout);
authRoute.get('/verify-email', validateMiddlewares.validateQuery(verifyEmail), AuthController.verifyEmail);
authRoute.post('/activate-account', validateMiddlewares.validateJson(login),  AuthController.activateAccount);
authRoute.post('/refresh-token', AuthController.refreshToken);
authRoute.post('/forgot-password', validateMiddlewares.validateJson(forgotPassord), AuthController.forgotPassword)
authRoute.patch('/reset-password', validateMiddlewares.validateJson(resetPassword), AuthController.resetPassword)

export default authRoute;