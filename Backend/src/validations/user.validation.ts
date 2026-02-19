import { z } from 'zod'

export const getUser = z.object({
    id: z.uuid().min(1)
});

export const createUser = z.object({
    email: z.email(),
    role: z.enum(['MAHASISWA', 'ADMIN', 'DOSEN'])
})

