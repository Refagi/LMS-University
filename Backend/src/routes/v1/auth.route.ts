import { Hono } from "hono";
import { AuthController } from "@/controllers/index.js";
import { auth } from "@/middlewares/auth";
import { validateMiddlewares } from "@/middlewares/validate.js";
import { login, logout } from "@/validations/auth.validation";

const authRoute = new Hono();

authRoute.post('/login', validateMiddlewares.validateJson(login), AuthController.login);
authRoute.post('/logout', AuthController.logout);

export default authRoute;