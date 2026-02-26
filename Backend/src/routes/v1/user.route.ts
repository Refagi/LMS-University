import { Hono } from "hono";
import { UserController } from "@/controllers/index.js";
import { auth } from "@/middlewares/auth";
import { validateMiddlewares } from "@/middlewares/validate.js";
import { updateUserEmail } from "@/validations/user.validation.js";
import { userId } from "@/validations/admin.validation";

const userRoute = new Hono();

userRoute.post('/request-update-email', auth(['MAHASISWA', 'DOSEN']), validateMiddlewares.validateJson(updateUserEmail), UserController.requestUpdateEmail);
userRoute.get('/verify-update-email',  UserController.verifyUpdateEmail);
userRoute.get('/profile/:userId', auth(['MAHASISWA', 'DOSEN']), validateMiddlewares.validateParam(userId), UserController.getProfileUser);

export default userRoute;