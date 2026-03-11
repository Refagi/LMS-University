import httpStatusCode from 'http-status-codes';
import prisma from '@/../prisma/client.js';
import { ApiError } from '@/utils/ApiError.js';
import type { ProgramStudyName, CreateStudyProgramType, GetAllProgramStudy, UpdateStudyProgramType } from '@/models/studyProgram.js';
import { Prisma } from '@/generated/prisma/client';

class AdminStudyProgramService {
  static async createProgramStudy (body: CreateStudyProgramType) {
    const { code, name, facultyId, degree, accreditation } = body;
    const studyProgram = await prisma.studyProgram.create({
      data: {
        code,
        name: name as ProgramStudyName,
        facultyId,
        degree,
        accreditation
      }
    })
    if (!studyProgram) {
      throw new ApiError(httpStatusCode.BAD_REQUEST, 'Gagal membuat program studi');
    }
    return studyProgram;
  }

  static async getProgramStudyById (prgramStudyId: string) {
    const programStudy = await prisma.studyProgram.findUnique({
      where: { id: prgramStudyId }
    })
    return programStudy
  }

  static async getAllProgramStudy (options: GetAllProgramStudy) {
    const { page = 1, limit = 5, search } = options
    const skip = (page - 1) * limit;
    const where: Prisma.StudyProgramWhereInput = {}
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [programStudies, totalCount] = await Promise.all([
      prisma.studyProgram.findMany({
        where,
        include: {
          Faculty: true
        },
        skip,
        take: limit
      }),
      prisma.studyProgram.count({where})
    ])

    const totalPages = Math.ceil(totalCount / limit);
    const nextPage = page < totalPages;
    const prevPage = page > 1;

    return {
      data: programStudies.map(ps => ({
        id: ps.id,
        code: ps.code,
        name: ps.name,
        degree: ps.degree,
        accreditaion: ps.accreditation,
        faculty: {
          code: ps.Faculty.code,
          name: ps.Faculty.name,
          accreditation: ps.Faculty.accreditation
        }
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        nextPage,
        prevPage,
      }
    }
  }

  static async updateProgramStudy (body: UpdateStudyProgramType) {
    const { programStudyId } = body;
    const existingProgramStudy = await this.getProgramStudyById(programStudyId);
    if (!existingProgramStudy) {
     throw new ApiError(httpStatusCode.NOT_FOUND, 'Program Study tidak ditemukan!');
    }
    const updateData = {
      ...(body.code !== undefined && { code: body.code }),
      ...(body.name !== undefined && { name: body.name as ProgramStudyName }),
      ...(body.degree !== undefined && { degree: body.degree }),
      ...(body.accreditation !== undefined && { accreditation: body.accreditation }),
      };
      if (Object.keys(updateData).length === 0) {
        throw new ApiError(400, 'Tidak ada field yang diupdate');
      }
    const programStudy = await prisma.studyProgram.update({
      where: { id: existingProgramStudy.id },
      data: updateData
    })
    return programStudy;
  }

  static async deleteProgramStudy (programStudyId: string) {
    const existingProgramStudy = await this.getProgramStudyById(programStudyId);
    if(!existingProgramStudy) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'Program Study tidak ditemukan!');
    }
    const programStudy = await prisma.studyProgram.delete({
      where: { id: programStudyId }
    })
    if (!programStudy) {
      throw new ApiError(httpStatusCode.BAD_REQUEST, 'Gagal menghapus fakultas');
    }
    return programStudy
  }


}

export default AdminStudyProgramService;
