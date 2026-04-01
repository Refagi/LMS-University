import httpStatusCode from 'http-status-codes';
import { ApiError } from '@/utils/ApiError.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { AdminSemesterService } from '@/services/index.js';
import { type  Context } from 'hono'
import type { ParamSemesterId, CreateSemesterBody, ActivateSemesterBody, UpdateSemesterBody } from '@/validations/admin.validation.js';


class AdminSemesterController {
  static createSemester = catchAsync(async (c: Context) => {
    const body = c.get('parsedJson') as CreateSemesterBody;
    const semester = await AdminSemesterService.createSemester(body);
    return c.json({message: 'Semester berhasil dibuat!', status: httpStatusCode.CREATED, data: semester})
  })

  static getAllSemester = catchAsync(async (c: Context) => {
    const semester = await AdminSemesterService.getAllSemester();
    return c.json({message: 'Berhasil mendapatkan semua semester!', status: httpStatusCode.OK, data: semester})
  })

  static getSemesterById = catchAsync(async (c: Context) => {
    const { semesterId } = c.get('parsedParam') as ParamSemesterId;
    const semester = await AdminSemesterService.getSemesterById(semesterId);
    if (!semester) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'Semester tidak ditemukan!');
    }
    return c.json({message: 'Berhasil mendapatkan semester!', status: httpStatusCode.OK, data: semester})
  })

  static activateSemester = catchAsync(async (c: Context) => {
    const { semesterId } = c.get('parsedParam') as ParamSemesterId;
    const { isActive } = c.get('parsedJson') as ActivateSemesterBody;
    const semester = await AdminSemesterService.activateSemester({semesterId, isActive});
    return c.json({message: 'Semester berhasil diaktifkan!', status: httpStatusCode.OK, data: semester})
  })

  static updateSemester = catchAsync(async (c: Context) => {
    const { semesterId } = c.get('parsedParam') as ParamSemesterId;
    const body = c.get('parsedJson') as UpdateSemesterBody;
    const semester = await AdminSemesterService.updateSemester({semesterId, ...body});
    return c.json({message: 'Semester berhasil diperbarui!', status: httpStatusCode.OK, data: semester})
  })

  static deleteSemester = catchAsync(async (c: Context) => {
    const { semesterId } = c.get('parsedParam') as ParamSemesterId;
    const semester = await AdminSemesterService.deleteSemester(semesterId);
    return c.json({message: 'Semester berhasil dihapus!', status: httpStatusCode.OK, data: semester})
  })
}

export default AdminSemesterController;
