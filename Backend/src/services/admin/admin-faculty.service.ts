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
            throw new ApiError(httpStatusCode.BAD_REQUEST, 'Failed to create fakultas');
        }
        return fakultas;
    }

    static async getFacultasByCode(code: string) {
        const fakultas = await prisma.faculty.findUnique({
            where: { code }
        })
        return fakultas;
    }
}

export default AdminFakultasService;