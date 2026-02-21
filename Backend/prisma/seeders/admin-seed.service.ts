import prisma from '@/../prisma/client'
import { logger } from '@/config/logger'
import { Role } from '@/generated/prisma/client'

export class AdminSeedService {
  private readonly email: string
  private readonly password: string

  constructor(email: string, password: string) {
    this.email = email
    this.password = password
  }

  public async execute(): Promise<void> {

    const hashedPassword = await this.hashPassword(this.password)
    await prisma.user.upsert({
        where: { email: this.email, role: Role.MAHASISWA },
        update: {},
        create: {
          email: this.email,
          password: hashedPassword,
          role: Role.MAHASISWA,
          isEmailVerified: true,
          status: 'ACTIVE'}
    })
    logger.info('ADMIN created successfully');
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await Bun.password.hash(password, {algorithm: 'bcrypt', cost: 10})
    return salt; 
 }
}
