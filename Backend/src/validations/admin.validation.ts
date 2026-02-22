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

export type ParamsId = z.infer<typeof userId>;
export type CreateUserBody = z.infer<typeof createUser>;
export type UpdateUserStatusBody = z.infer<typeof updateUserStatusByAdmin>;