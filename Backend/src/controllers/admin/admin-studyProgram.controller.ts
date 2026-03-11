import httpStatusCode from 'http-status-codes';
import { ApiError } from '@/utils/ApiError.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { AdminStudyProgramService } from '@/services/index.js';
import { type  Context } from 'hono'
import type { ParamProgramStudyId, CreateStudyProgramBody, GetAllProgramStudyQuery, UpdateProgramStudyBody } from '@/validations/admin.validation.js';
import { AccreditationType } from '@/models/fakultas.model.js';

class AdminStudyProgramController {
  static createProgramStudy = catchAsync(async (c: Context) => {
    const { code, name, facultyId, degree, accreditation } = c.get('parsedJson') as CreateStudyProgramBody;
    const studyProgram = await AdminStudyProgramService.createProgramStudy({ code, name, facultyId, degree, accreditation: accreditation as AccreditationType });
    return c.json({message: 'Program studi berhasil dibuat!', status: httpStatusCode.CREATED, data: studyProgram})
  })

  static getProgramStudy = catchAsync(async (c: Context) => {
    const { programStudyId } = c.get('parsedParam') as ParamProgramStudyId;
    const studyProgram = await AdminStudyProgramService.getProgramStudyById(programStudyId);
    if (!studyProgram) {
      throw new ApiError(httpStatusCode.NOT_FOUND, 'Program studi tidak ditemukan!');
    }
    return c.json({message: 'Berhasil mendapatkan program studi!', status: httpStatusCode.OK, data: studyProgram})
  })

  static getAllProgramStudy = catchAsync(async (c: Context) => {
    const options = c.get('parsedQuery') as GetAllProgramStudyQuery;
    const studyProgram = await AdminStudyProgramService.getAllProgramStudy(options);
    return c.json({message: 'Berhasil mendapatkan semua program studi!', status: httpStatusCode.OK, data: studyProgram})
  })

  static updateProgramStudy = catchAsync(async (c: Context) => {
    const { programStudyId } = c.get('parsedParam') as ParamProgramStudyId;
    const body = c.get('parsedJson') as UpdateProgramStudyBody;
    const studyProgram = await AdminStudyProgramService.updateProgramStudy({ programStudyId, ...body});
    return c.json({message: 'Program studi berhasil diperbarui!', status: httpStatusCode.OK, data: studyProgram})
  })

  static deleteProgramStudy = catchAsync(async (c: Context) => {
    const { programStudyId } = c.get('parsedParam') as ParamProgramStudyId;
    const studyProgram = await AdminStudyProgramService.deleteProgramStudy(programStudyId);
    return c.json({message: 'Program studi berhasil dihapus!', status: httpStatusCode.OK, data: studyProgram})
  })
}

export default AdminStudyProgramController;
