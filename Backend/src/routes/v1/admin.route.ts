import { Hono } from "hono";
import { AdminController, AuthController } from "@/controllers/index.js";
import { auth } from "@/middlewares/auth";
import { validateMiddlewares } from "@/middlewares/validate.js";
import { getUser, createUser, updateUserEmailByAdmin, updateUserStatusByAdmin } from "@/validations/admin.validation.js";

const adminRoute = new Hono();

adminRoute.use('/getStudent/:id', auth(['SUPER_ADMIN', 'ADMIN']), validateMiddlewares.validateParam(getUser), AdminController.getUsers);
adminRoute.use('/createUser', auth(['SUPER_ADMIN', 'ADMIN']), validateMiddlewares.validateJson(createUser), AdminController.createUser);
adminRoute.use('/updateUserEmail/:id', auth(['SUPER_ADMIN', 'ADMIN']), validateMiddlewares.validateJson(updateUserEmailByAdmin), AdminController.updateUserEmailByAdmin);
adminRoute.use('/updateUserStatus/:id', auth(['SUPER_ADMIN', 'ADMIN']), validateMiddlewares.validateJson(updateUserStatusByAdmin), AdminController.updateUserStatusByAdmin);


export default adminRoute;