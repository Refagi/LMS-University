import httpStatusCode from 'http-status-codes';
import prisma from '@/../prisma/client.js';
import { ApiError } from '@/utils/ApiError.js';
import { Prisma } from '@/generated/prisma/client.js';
import type { CreateFakultasType, FakultasName } from '@/models/fakultas.model';

type Fakultas = Prisma.FacultyGetPayload<{}>;

class AdminFakultasService {
    static async createFakultas (body: CreateFakultasType) {
        const { code, name } = body;
        const fakultas = await prisma.faculty.create({
            data: {
                code,
                name: name as FakultasName
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

    static async getFacultasById(id: string) {
        const fakultas = await prisma.faculty.findUnique({
            where: { id },
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

    static async updaateFakultas (id: string, body: CreateFakultasType) {
        const { code, name } = body;
        const fakultas = await prisma.faculty.update({
            where: { id },
            data: {
                code,
                name: name as FakultasName
            }
        })

        if (!fakultas) {
            throw new ApiError(httpStatusCode.BAD_REQUEST, 'Gagal Update fakultas');
        }

        return fakultas;
    }

    static async deleteFakultas (id: string) {
        const existingFakultas = await this.getFacultasById(id);
        if (!existingFakultas) {
            throw new ApiError(httpStatusCode.NOT_FOUND, 'Fakultas tidak ditemukan!');
        }
        const fakultas = await prisma.faculty.delete({
            where: { id }
        });
        if (!fakultas) {
            throw new ApiError(httpStatusCode.BAD_REQUEST, 'Gagal menghapus fakultas');
        }
        return fakultas;
    }
}

export default AdminFakultasService;