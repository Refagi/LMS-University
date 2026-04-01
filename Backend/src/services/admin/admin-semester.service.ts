import httpStatusCode from 'http-status-codes';
import prisma from '@/../prisma/client.js';
import { ApiError } from '@/utils/ApiError.js';
import type { CreateSemesterType, UpdateSemesterStatusType, UpdateSemesterType } from '@/models/semester.model.js';

export class AdminSemesterService {
  static async createSemester(body: CreateSemesterType) {
    const { name, type, year, startDate, endDate, isActive } = body;
    const semester = await prisma.semester.create({
      data: {
        name,
        type,
        year,
        startDate,
        endDate,
        isActive
      }
    })
    if (!semester) {
      throw new ApiError(httpStatusCode.BAD_REQUEST, 'Gagal membuat semester');
    }
    return semester;
  }

  static async getAllSemester() {
    const semester = await prisma.semester.findMany();
    if (!semester) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'Semester tidak ditemukan');
    }
    return semester;
  }

  static async getSemesterById(semesterId: string) {
    const semester = await prisma.semester.findUnique({
      where: { id: semesterId }
    })
    return semester
  }

  static async activateSemester(body: UpdateSemesterStatusType) {
    const { semesterId, isActive } = body;
    const existingSemester = await this.getSemesterById(semesterId);
    if(!existingSemester) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'Semester tidak ditemukan!');
    }
    const semester = await prisma.semester.update({
      where: { id: existingSemester.id },
      data: { isActive }
    })
    return semester
  }

  static async updateSemester(body: UpdateSemesterType) {
    const { semesterId } = body;
    const existingSemester = await this.getSemesterById(semesterId);
    if(!existingSemester) {
     throw new ApiError(httpStatusCode.NOT_FOUND, 'Semester tidak ditemukan!');
    }
    const updateData = {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.year !== undefined && { year: body.year }),
      ...(body.type !== undefined && { type: body.type }),
      ...(body.startDate !== undefined && { startDate: body.startDate }),
      ...(body.endDate !== undefined && { endDate: body.endDate }),
    };
    if (Object.keys(updateData).length === 0) {
      throw new ApiError(httpStatusCode.BAD_REQUEST, 'Tidak ada field yang diupdate');
    }
    const semester = await prisma.semester.update({
      where: { id: existingSemester.id },
      data: updateData
    })
    return semester
  }

  static async deleteSemester(semesterId: string) {
    const existingSemester = await this.getSemesterById(semesterId);
    if(!existingSemester) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'Semester tidak ditemukan!');
    }
    const semester = await prisma.semester.delete({
      where: { id: existingSemester.id }
    })
    return semester
  }
}

export default AdminSemesterService;

