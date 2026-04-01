import httpStatusCode from 'http-status-codes';
import { ApiError } from '@/utils/ApiError.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { AdminScheduleService } from '@/services/index.js';
import { type  Context } from 'hono'
import type { ParamScheduleId, CreateScheduleBody, UpdateScheduleBody } from '@/validations/admin.validation.js';

class AdminScheduleController {
  static createSchedule = catchAsync(async (c: Context) => {
    const body = c.get('parsedJson') as CreateScheduleBody;
    const schedule = await AdminScheduleService.createSchedule(body);
    return c.json({message: 'Jadwal berhasil dibuat!', status: httpStatusCode.CREATED, data: schedule})
  })

  static getAllSchedule = catchAsync(async (c: Context) => {
    const schedule = await AdminScheduleService.getAllSchedule();
    return c.json({message: 'Berhasil mendapatkan semua jadwal!', status: httpStatusCode.OK, data: schedule})
  })

  static getScheduleById = catchAsync(async (c: Context) => {
    const { scheduleId } = c.get('parsedParam') as ParamScheduleId;
    const schedule = await AdminScheduleService.getScheduleById(scheduleId);
    if (!schedule) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'Jadwal tidak ditemukan!');
    }
    return c.json({message: 'Berhasil mendapatkan jadwal!', status: httpStatusCode.OK, data: schedule})
  })

  static updateSchedule = catchAsync(async (c: Context) => {
    const { scheduleId } = c.get('parsedParam') as ParamScheduleId;
    const body = c.get('parsedJson') as UpdateScheduleBody;
    const schedule = await AdminScheduleService.updateSchedule({scheduleId, ...body});
    return c.json({message: 'Jadwal berhasil diperbarui!', status: httpStatusCode.OK, data: schedule})
  })

  static deleteSchedule = catchAsync(async (c: Context) => {
    const { scheduleId } = c.get('parsedParam') as ParamScheduleId;
    const schedule = await AdminScheduleService.deleteSchedule(scheduleId);
    return c.json({message: 'Jadwal berhasil dihapus!', status: httpStatusCode.OK, data: schedule})
  })
}

export default AdminScheduleController;
