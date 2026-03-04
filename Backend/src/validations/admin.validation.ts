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
    fakultasId: z.string().uuid()
})
export type ParamFakutasId = z.infer<typeof facultasId>;

export const CreateFakultasBody = z.object({
    code: z.string().min(3, 'Code fakultas harus diisi'),
    name: z.string().min(10, 'Nama fakultas harus diisi'),
})
export type CreateFakultas = z.infer<typeof CreateFakultasBody>;


export const UpdateFakultasSchema = CreateFakultasBody.partial();
export type UpdateFakultas = z.infer<typeof UpdateFakultasSchema>;