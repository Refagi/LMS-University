import { z } from 'zod'

export const userId = z.object({
    userId: z.uuid().min(1)
});
export type ParamUserId = z.infer<typeof userId>;


export const createUser = z.object({
    email: z.email(),
    role: z.enum(['MAHASISWA', 'ADMIN', 'DOSEN'])
})
export type CreateUserBody = z.infer<typeof createUser>;


export const updateUserStatusByAdmin = z.object({
    status: z.enum(['PENDING', 'ACTIVE', 'SUSPENDED'])
})
export type UpdateUserStatusBody = z.infer<typeof updateUserStatusByAdmin>;


export const getAllUsersQuerySchema = z.object({
  page: z.string().optional().default('1').transform(Number),
  limit: z.string().optional().default('10').transform(Number),
  search: z.string().optional(),
  role: z.enum(['SUPER_ADMIN','ADMIN', 'DOSEN', 'MAHASISWA']).optional(),
  status: z.enum(['PENDING', 'ACTIVE', 'SUSPENDED']).optional(),
  faculty: z.string().optional(),
  studyProgram: z.string().optional(),
  sortBy: z.enum(['email', 'fullName', 'role', 'status', 'createdAt']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});
export type GetAllUsersQuery = z.infer<typeof getAllUsersQuerySchema>;


export const facultasId = z.object({
    fakultasId: z.uuid().min(1)
})
export type ParamFakutasId = z.infer<typeof facultasId>;

export const createFakultasBody = z.object({
    code: z.string().min(3, 'Code fakultas harus diisi'),
    name: z.string().min(10, 'Nama fakultas harus diisi'),
    accreditation: z.enum(['UNGGUL', 'BAIK_SEKALI', 'BAIK', 'TIDAK_AKREDITASI'])
})
export type CreateFakultas = z.infer<typeof createFakultasBody>;


export const updateFakultasBody = z.object({
    code: z.string().min(3).optional(),
    name: z.string().min(10).optional(),
    accreditation: z.enum(['UNGGUL', 'BAIK_SEKALI', 'BAIK', 'TIDAK_AKREDITASI']).optional(),
})
export type UpdateFakultas = z.infer<typeof updateFakultasBody>;


export const programStudyId = z.object({
    programStudyId: z.uuid().min(1)
})
export type ParamProgramStudyId = z.infer<typeof programStudyId>;

export const createStudyProgramBody = z.object({
    code: z.string().min(3, 'Code program studi harus diisi'),
    name: z.string().min(10, 'Nama program studi harus diisi'),
    facultyId: z.uuid().min(1, 'ID fakultas harus diisi'),
    degree: z.string().min(2, 'Gelar program studi harus diisi'),
    accreditation: z.enum(['UNGGUL', 'BAIK_SEKALI', 'BAIK', 'TIDAK_AKREDITASI'])
})
export type CreateStudyProgram = z.infer<typeof createStudyProgramBody>;

export const getAllProgramStudySchema = z.object({
    page: z.string().optional().default('1').transform(Number),
    limit: z.string().optional().default('5').transform(Number),
    search: z.string().optional(),
})
export type GetAllProgramStudy = z.infer<typeof getAllProgramStudySchema>;

export const updateProgramStudyBody = z.object({
    code: z.string().min(3).optional(),
    name: z.string().min(10).optional(),
    degree: z.string().min(2).optional(),
    accreditation: z.enum(['UNGGUL', 'BAIK_SEKALI', 'BAIK', 'TIDAK_AKREDITASI']).optional(),
})
export type UpdateProgramStudy = z.infer<typeof updateProgramStudyBody>;
