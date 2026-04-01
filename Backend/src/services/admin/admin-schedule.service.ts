import httpStatusCode from 'http-status-codes';
import prisma from '@/../prisma/client.js';
import { ApiError } from '@/utils/ApiError.js';
import { Prisma } from '@/generated/prisma/client.js';
import type { ScheduleType, UpdateScheduleType } from '@/models/schedule.model';


class AdminClassService {
  static async createSchedule(body: ScheduleType) {
    const { day, startTime, endTime } = body;
    const schedule = await prisma.schedule.create({
      data: {
        day,
        startTime,
        endTime
      }
    })
    return schedule;
  }

  static async getAllSchedule() {
    const schedule = await prisma.schedule.findMany();
    return schedule;
  }

  static async getScheduleById(scheduleId: string) {
    const schedule = await prisma.schedule.findUnique({
      where: { id: scheduleId }
    })
    return schedule;
  }

  static async updateSchedule(body: UpdateScheduleType) {
    const { scheduleId } = body
    const existingSchedule = await this.getScheduleById(scheduleId);
    if (!existingSchedule) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'Jadwal tidak ditemukan!');
    }
    const updateData = {
      ...(body.day !== undefined && { day: body.day }),
      ...(body.startTime !== undefined && { startTime: body.startTime }),
      ...(body.endTime !== undefined && { endTime: body.endTime }),
    }
    if (Object.keys(updateData).length === 0) {
      throw new ApiError(httpStatusCode.BAD_REQUEST, 'Tidak ada field yang diupdate');
    }
    const schedule = await prisma.schedule.update({
      where: { id: existingSchedule.id },
      data: updateData
    })
    return schedule;
  }

  static async deleteSchedule(scheduleId: string) {
    const existingSchedule = await this.getScheduleById(scheduleId);
    if (!existingSchedule) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'Jadwal tidak ditemukan!');
    }
    const schedule = await prisma.schedule.delete({
      where: { id: existingSchedule.id },
    })
    return schedule;
  }
}

export default AdminClassService;
