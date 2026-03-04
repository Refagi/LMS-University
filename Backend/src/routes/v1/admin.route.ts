import { Hono } from "hono";
import { AdminUserController, AdminFacultyController } from "@/controllers/index.js";
import { auth } from "@/middlewares/auth";
import { validateMiddlewares } from "@/middlewares/validate.js";
import { userId, createUser, updateUserStatusByAdmin, getAllUsersQuerySchema, CreateFakultasBody,
    facultasId
 } from "@/validations/admin.validation.js";

const adminRoute = new Hono();

adminRoute.post('/users', auth(['SUPER_ADMIN', 'ADMIN']), validateMiddlewares.validateJson(createUser), AdminUserController.createUser);
adminRoute.get('/users', auth(['SUPER_ADMIN', 'ADMIN']), validateMiddlewares.validateQuery(getAllUsersQuerySchema), AdminUserController.getAllUser);
adminRoute.get('/users/:userId', auth(['SUPER_ADMIN', 'ADMIN']), validateMiddlewares.validateParam(userId), AdminUserController.getUser);
adminRoute.patch('/users/:userId/status', auth(['SUPER_ADMIN', 'ADMIN']), 
                validateMiddlewares.validateParam(userId), 
                validateMiddlewares.validateJson(updateUserStatusByAdmin), 
                AdminUserController.updateUserStatusByAdmin);
adminRoute.patch('/users/:userId/reset-password', auth(['SUPER_ADMIN', 'ADMIN']), validateMiddlewares.validateParam(userId),AdminUserController.resetPasswordByAdmin);
adminRoute.delete('/users/:userId', auth(['SUPER_ADMIN', 'ADMIN']), validateMiddlewares.validateParam(userId), AdminUserController.deleteUser);

adminRoute.post('/faculties', auth(['SUPER_ADMIN']), validateMiddlewares.validateJson(CreateFakultasBody), AdminFacultyController.createFakultas)
adminRoute.get('/faculties', auth(['SUPER_ADMIN', 'ADMIN']), AdminFacultyController.getAllFakultas)
adminRoute.patch('/faculties/:fakultasId', auth(['SUPER_ADMIN']), 
                validateMiddlewares.validateParam(facultasId), 
                validateMiddlewares.validateJson(CreateFakultasBody),
                AdminFacultyController.updateFakultas);
adminRoute.delete('/faculties/:fakultasId', auth(['SUPER_ADMIN']), validateMiddlewares.validateParam(facultasId), AdminFacultyController.deleteFakultas)

export default adminRoute;