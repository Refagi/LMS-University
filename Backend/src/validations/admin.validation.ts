import { z } from 'zod'

export const userId = z.object({
    userId: z.uuid().min(1)
});

export const createUser = z.object({
    email: z.email(),
    role: z.enum(['MAHASISWA', 'ADMIN', 'DOSEN'])
})

export const updateUserStatusByAdmin = z.object({
    status: z.enum(['PENDING', 'ACTIVE', 'SUSPENDED'])
})

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

export const CreateFakultasSchema = z.object({
    code: z.string().min(5, 'Code fakultas harus diisi'),
    name: z.string().min(10, 'Nama fakultas harus diisi'),
})

export type CreateFakultas = z.infer<typeof CreateFakultasSchema>;
export type GetAllUsersQuery = z.infer<typeof getAllUsersQuerySchema>;
export type ParamsId = z.infer<typeof userId>;
export type CreateUserBody = z.infer<typeof createUser>;
export type UpdateUserStatusBody = z.infer<typeof updateUserStatusByAdmin>;
