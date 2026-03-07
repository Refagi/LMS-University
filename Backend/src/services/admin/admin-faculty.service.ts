import httpStatusCode from 'http-status-codes';
import prisma from '@/../prisma/client.js';
import { ApiError } from '@/utils/ApiError.js';
import { Prisma } from '@/generated/prisma/client.js';
import type { CreateFakultasType, FakultasName, UpdateFakultasType } from '@/models/fakultas.model';

type Fakultas = Prisma.FacultyGetPayload<{}>;

class AdminFakultasService {
    static async createFakultas (body: CreateFakultasType) {
        const { code, name, accreditation } = body;
        const fakultas = await prisma.faculty.create({
            data: {
                code,
                name: name as FakultasName,
                accreditation
            }
        })
        if (!fakultas) {
            throw new ApiError(httpStatusCode.BAD_REQUEST, 'Gagl membuat fakultas');
        }
        return fakultas;
    }

    static async getFacultasByCode(code: string) {
        const fakultas = await prisma.faculty.findUnique({
            where: { code },
            include: {
                StudyProgram: true
            }
        })
        return fakultas;
    }

    static async getFacultasById(fakultasId: string) {
        const fakultas = await prisma.faculty.findUnique({
            where: { id: fakultasId },
        })
        return fakultas;
    }

    static async getAllFakultas () {
        const fakultas = await prisma.faculty.findMany({
            include: {
                StudyProgram: true
            }
        })
        return fakultas;
    }

    static async updateFakultas (fakultasId: string, body: UpdateFakultasType) {
        const updateData = {
        ...(body.code !== undefined && { code: body.code }),
        ...(body.name !== undefined && { name: body.name as FakultasName }),
        ...(body.accreditation !== undefined && { accreditation: body.accreditation }),
      };

      if (Object.keys(updateData).length === 0) {
        throw new ApiError(400, 'Tidak ada field yang diupdate');
      }
        const fakultas = await prisma.faculty.update({
            where: { id: fakultasId },
            data: updateData
        })

        return fakultas;
    }

    static async deleteFakultas (fakultasId: string) {
        const existingFakultas = await this.getFacultasById(fakultasId);
        if (!existingFakultas) {
            throw new ApiError(httpStatusCode.NOT_FOUND, 'Fakultas tidak ditemukan!');
        }
        const fakultas = await prisma.faculty.delete({
            where: { id: fakultasId }
        });
        if (!fakultas) {
            throw new ApiError(httpStatusCode.BAD_REQUEST, 'Gagal menghapus fakultas');
        }
        return fakultas;
    }
}

export default AdminFakultasService;
