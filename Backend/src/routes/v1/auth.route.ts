import { Hono } from "hono";
import { AuthController } from "@/controllers/index.js";
import { auth } from "@/middlewares/auth";
import { validateMiddlewares } from "@/middlewares/validate.js";
import { login } from "@/validations/auth.validation";

const authRoute = new Hono();

authRoute.post('/login', validateMiddlewares.validateJson(login), AuthController.login);

export default authRoute;