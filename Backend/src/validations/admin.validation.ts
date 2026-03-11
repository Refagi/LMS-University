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
export type CreateFakultasBody = z.infer<typeof createFakultasBody>;


export const updateFakultasSchema = z.object({
    code: z.string().min(3).optional(),
    name: z.string().min(10).optional(),
    accreditation: z.enum(['UNGGUL', 'BAIK_SEKALI', 'BAIK', 'TIDAK_AKREDITASI']).optional(),
})
export type UpdateFakultasBody = z.infer<typeof updateFakultasSchema>;


export const programStudyId = z.object({
    programStudyId: z.uuid().min(1)
})
export type ParamProgramStudyId = z.infer<typeof programStudyId>;

export const createProgramStudySchema = z.object({
    code: z.string().min(3, 'Code program studi harus diisi'),
    name: z.string().min(10, 'Nama program studi harus diisi'),
    facultyId: z.uuid().min(1, 'ID fakultas harus diisi'),
    degree: z.string().min(2, 'Gelar program studi harus diisi'),
    accreditation: z.enum(['UNGGUL', 'BAIK_SEKALI', 'BAIK', 'TIDAK_AKREDITASI'])
})
export type CreateStudyProgramBody = z.infer<typeof createProgramStudySchema>;

export const getAllProgramStudySchema = z.object({
    page: z.string().optional().default('1').transform(Number),
    limit: z.string().optional().default('5').transform(Number),
    search: z.string().optional(),
})
export type GetAllProgramStudyQuery = z.infer<typeof getAllProgramStudySchema>;

export const updateProgramStudySchema = z.object({
    code: z.string().min(3).optional(),
    name: z.string().min(10).optional(),
    degree: z.string().min(2).optional(),
    accreditation: z.enum(['UNGGUL', 'BAIK_SEKALI', 'BAIK', 'TIDAK_AKREDITASI']).optional(),
})
export type UpdateProgramStudyBody = z.infer<typeof updateProgramStudySchema>;


export const semesterId = z.object({
    semesterId: z.uuid().min(1)
})
export type ParamSemesterId = z.infer<typeof semesterId>;

export const createSemesterScheme = z.object({
    name: z.string().min(5),
    type: z.enum(['GANJIL', 'GENAP']),
    year: z.number(),
    startDate: z.date(),
    endDate: z.date(),
    isActive: z.boolean().default(false)
})
export type CreateSemesterBody = z.infer<typeof createSemesterScheme>;

export const activateSemesterSchema = z.object({
    isActive: z.boolean()
})
export type ActivateSemesterBody = z.infer<typeof activateSemesterSchema>;
