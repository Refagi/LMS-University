import { z } from 'zod'

export const getUser = z.object({
    id: z.uuid().min(1)
});

export const createUser = z.object({
    email: z.email(),
    role: z.enum(['MAHASISWA', 'ADMIN', 'DOSEN'])
})

export const updateUserEmailByAdmin = z.object({
    userId: z.uuid().min(1),
    newEmail: z
      .email({ message: 'Email must be a valid email address' })
      .refine((email) => email.endsWith('@gmail.com'), { message: 'Email must end with @gmail.com' }),
})

export const updateUserStatusByAdmin = z.object({
    userId: z.uuid().min(1),
    status: z.enum(['PENDING', 'ACTIVE', 'SUSPENDED'])
})