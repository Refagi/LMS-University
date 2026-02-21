import { z } from 'zod'


export const updateUserEmail = z.object({
    newEmail: z
      .email({ message: 'Email must be a valid email address' })
      .refine((email) => email.endsWith('@gmail.com'), { message: 'Email must end with @gmail.com' }),
})
