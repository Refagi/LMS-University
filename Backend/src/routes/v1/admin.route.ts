import { Hono } from "hono";
import { AdminController } from "@/controllers/index.js";
import { auth } from "@/middlewares/auth";
import { validateMiddlewares } from "@/middlewares/validate.js";
import { getStudent, createStudent } from "@/validations/student.validation.js";

const adminRoute = new Hono();

adminRoute.use('/getStudent/:id', auth('ADMIN'), validateMiddlewares.validateParam(getStudent), AdminController.getUsers);
adminRoute.use('/createUser', auth('ADMIN'), validateMiddlewares.validate(createStudent), AdminController.createUser);

export default adminRoute;