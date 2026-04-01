import { Hono } from "hono";
import { AdminUserController, AdminFacultyController, AdminStudyProgramController, AdminSemesterController, AdminScheduleController } from "@/controllers/index.js";
import { auth } from "@/middlewares/auth";
import { validateMiddlewares } from "@/middlewares/validate.js";
import {
  userId,
  createUser,
  updateUserStatusByAdmin,
  getAllUsersQuerySchema,
  createFakultasBody,
  facultasId,
  createProgramStudySchema,
  updateProgramStudySchema,
  programStudyId,
  getAllProgramStudySchema,
  semesterId,
  createSemesterScheme,
  activateSemesterSchema,
  createScheduleSchema,
  updateScheduleSchema,
  scheduleId
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

adminRoute.post('/faculties', auth(['SUPER_ADMIN']), validateMiddlewares.validateJson(createFakultasBody), AdminFacultyController.createFakultas)
adminRoute.get('/faculties', auth(['SUPER_ADMIN', 'ADMIN']), AdminFacultyController.getAllFakultas)
adminRoute.get('/faculties/:fakultasId', auth(['SUPER_ADMIN', 'ADMIN']), validateMiddlewares.validateParam(facultasId), AdminFacultyController.getFakultasById)
adminRoute.patch('/faculties/:fakultasId', auth(['SUPER_ADMIN']),
                validateMiddlewares.validateParam(facultasId),
                validateMiddlewares.validateJson(createFakultasBody),
                AdminFacultyController.updateFakultas);
adminRoute.delete('/faculties/:fakultasId', auth(['SUPER_ADMIN']), validateMiddlewares.validateParam(facultasId), AdminFacultyController.deleteFakultas)

adminRoute.post('/study-programs', auth(['SUPER_ADMIN']), validateMiddlewares.validateJson(createProgramStudySchema), AdminStudyProgramController.createProgramStudy)
adminRoute.get('/study-programs/:programStudyId', auth(['SUPER_ADMIN', 'ADMIN']), validateMiddlewares.validateParam(programStudyId), AdminStudyProgramController.getProgramStudy)
adminRoute.get('/study-programs', auth(['SUPER_ADMIN', 'ADMIN']), validateMiddlewares.validateQuery(getAllProgramStudySchema), AdminStudyProgramController.getAllProgramStudy)
adminRoute.patch('/study-programs/:programStudyId', auth(['SUPER_ADMIN']),
                validateMiddlewares.validateParam(programStudyId),
                validateMiddlewares.validateJson(updateProgramStudySchema),
                AdminStudyProgramController.updateProgramStudy);
adminRoute.delete('/study-programs/:programStudyId', auth(['SUPER_ADMIN']), validateMiddlewares.validateParam(programStudyId), AdminStudyProgramController.deleteProgramStudy)


adminRoute.post('/semester', auth(['SUPER_ADMIN']), validateMiddlewares.validateJson(createSemesterScheme), AdminSemesterController.createSemester)
adminRoute.get('/semester', auth(['SUPER_ADMIN', 'ADMIN']), AdminSemesterController.getAllSemester)
adminRoute.get('/semester/:semesterId', auth(['SUPER_ADMIN', 'ADMIN']), validateMiddlewares.validateParam(semesterId), AdminSemesterController.getSemesterById)
adminRoute.patch('/semester/:semesterId/status', auth(['SUPER_ADMIN']),
                validateMiddlewares.validateParam(semesterId),
                validateMiddlewares.validateJson(activateSemesterSchema),
                AdminSemesterController.activateSemester);
adminRoute.patch('/semester/:semesterId', auth(['SUPER_ADMIN']),
                validateMiddlewares.validateParam(semesterId),
                validateMiddlewares.validateJson(createSemesterScheme),
                AdminSemesterController.updateSemester);
adminRoute.delete('/semester/:semesterId', auth(['SUPER_ADMIN']), validateMiddlewares.validateParam(semesterId), AdminSemesterController.deleteSemester)


adminRoute.post('/schedules', auth(['SUPER_ADMIN', 'ADMIN']), validateMiddlewares.validateJson(createScheduleSchema), AdminScheduleController.createSchedule)
adminRoute.get('/schedules', auth(['SUPER_ADMIN', 'ADMIN']), AdminScheduleController.getAllSchedule)
adminRoute.get('/schedules/:scheduleId', auth(['SUPER_ADMIN', 'ADMIN']), validateMiddlewares.validateParam(scheduleId), AdminScheduleController.getScheduleById)
adminRoute.patch('/schedules/:scheduleId', auth(['SUPER_ADMIN', 'ADMIN']),
                validateMiddlewares.validateParam(scheduleId),
                validateMiddlewares.validateJson(updateScheduleSchema),
                AdminScheduleController.updateSchedule);
adminRoute.delete('/schedules/:scheduleId', auth(['SUPER_ADMIN', 'ADMIN']), validateMiddlewares.validateParam(scheduleId), AdminScheduleController.deleteSchedule)

export default adminRoute;
