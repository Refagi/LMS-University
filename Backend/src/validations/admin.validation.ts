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
  role: z.enum(['ADMIN', 'DOSEN', 'MAHASISWA']).optional(),
  status: z.enum(['PENDING', 'ACTIVE', 'SUSPENDED']).optional(),
  faculty: z.string().optional(),
  studyProgram: z.string().optional(),
  isEmailVerified: z.string().optional().transform(val => val === 'true'),  
  sortBy: z.enum(['email', 'fullName', 'role', 'status']).optional().default('fullName'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type GetAllUsersQuery = z.infer<typeof getAllUsersQuerySchema>;
export type ParamsId = z.infer<typeof userId>;
export type CreateUserBody = z.infer<typeof createUser>;
export type UpdateUserStatusBody = z.infer<typeof updateUserStatusByAdmin>;
