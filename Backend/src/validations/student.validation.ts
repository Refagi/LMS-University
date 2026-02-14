import { z } from 'zod'

export const getStudent = z.object({
    id: z.uuid().min(1)
});

export const createStudent = z.object({
    email: z.email(),
    status: z.enum(['PENDING', 'ACTIVE', 'INACTIVE']),
    role: z.enum(['MAHASISWA'])
})

