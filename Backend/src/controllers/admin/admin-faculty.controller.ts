import httpStatusCode from 'http-status-codes';
import { ApiError } from '@/utils/ApiError.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { AdminFakultasService } from '@/services/index.js';
import { type  Context } from 'hono'
import type { ParamFakutasId, CreateFakultas, UpdateFakultas } from '@/validations/admin.validation.js';
import { AccreditationType } from '@/models/fakultas.model.js';

class AdminFacultyController {
    static createFakultas = catchAsync(async (c: Context) => {
        const { code, name, accreditation } = c.get('parsedJson') as CreateFakultas;
        const existingFakultas = await AdminFakultasService.getFacultasByCode(code);
        if (existingFakultas) {
            throw new ApiError(httpStatusCode.BAD_REQUEST, 'Fakultas dengan code tersebut sudah ada!');
        }
        const fakultas = await AdminFakultasService.createFakultas({ code, name, accreditation: accreditation as AccreditationType });
        return c.json({message: 'Fakultas berhasil dibuat!', status: httpStatusCode.CREATED, data: fakultas})
    });

    static getAllFakultas = catchAsync(async (c: Context) => {
        const fakultas = await AdminFakultasService.getAllFakultas();
        return c.json({message: 'Berhasil mendapatkan semua fakultas!', status: httpStatusCode.OK, data: fakultas})
    })

    static getFakultasById = catchAsync(async (c: Context) => {
        const { fakultasId } = c.get('parsedParam') as ParamFakutasId;
        const fakultas = await AdminFakultasService.getFacultasById(fakultasId);
        if (!fakultas) {
            throw new ApiError(httpStatusCode.NOT_FOUND, 'Fakultas tidak ditemukan!');
        }
        return c.json({message: 'Berhasil mendapatkan fakultas!', status: httpStatusCode.OK, data: fakultas})
    })

    static updateFakultas = catchAsync(async (c: Context) => {
        const { fakultasId } = c.get('parsedParam') as ParamFakutasId;
        const body = c.get('parsedJson') as UpdateFakultas;
        const fakultas = await AdminFakultasService.updateFakultas(fakultasId, body);
        return c.json({message: 'Fakultas berhasil diperbarui!', status: httpStatusCode.OK, data: fakultas})
    })

    static deleteFakultas = catchAsync(async (c: Context) => {
        const { fakultasId } = c.get('parsedParam') as ParamFakutasId;
        const fakultas = await AdminFakultasService.deleteFakultas(fakultasId);
        return c.json({message: 'Fakultas berhasil dihapus!', status: httpStatusCode.OK, data: fakultas})
    })

}

export default AdminFacultyController;
