import { Hono } from "hono";
import { AdminController, AuthController } from "@/controllers/index.js";
import { auth } from "@/middlewares/auth";
import { validateMiddlewares } from "@/middlewares/validate.js";
import { userId, createUser, updateUserStatusByAdmin } from "@/validations/admin.validation.js";

const adminRoute = new Hono();

adminRoute.get('/getStudent/:userId', auth(['SUPER_ADMIN', 'ADMIN']), validateMiddlewares.validateParam(userId), AdminController.getUser);
adminRoute.post('/createUser', auth(['SUPER_ADMIN', 'ADMIN']), validateMiddlewares.validateJson(createUser), AdminController.createUser);
adminRoute.patch('/updateUserStatus/:userId', auth(['SUPER_ADMIN', 'ADMIN']), 
validateMiddlewares.validateParam(userId), 
validateMiddlewares.validateJson(updateUserStatusByAdmin), 
AdminController.updateUserStatusByAdmin);
adminRoute.patch('/resetPassword/:userId', auth(['SUPER_ADMIN', 'ADMIN']), 
validateMiddlewares.validateParam(userId),
AdminController.resetPasswordByAdmin) 

export default adminRoute;