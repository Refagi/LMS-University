import httpStatusCode from 'http-status-codes';
import { ApiError } from '@/utils/ApiError.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { AdminFakultasService } from '@/services/index.js';
import { type  Context } from 'hono'
import type { ParamsId, CreateFakultas } from '@/validations/admin.validation.js';

class AdminFacultyController {
    static createFakultas = catchAsync(async (c: Context) => {
        const { code, name } = c.get('parsedJson') as CreateFakultas; 
        const existingFakultas = await AdminFakultasService.getFacultasByCode(code);
        if (existingFakultas) {
            throw new ApiError(httpStatusCode.BAD_REQUEST, 'Fakultas dengan code tersebut sudah ada!');
        }
        const fakultas = await AdminFakultasService.createFakultas({ code, name });
        return c.json({message: 'Fakultas berhasil dibuat!', status: httpStatusCode.CREATED, data: fakultas})
    });

    
}

export default AdminFacultyController;