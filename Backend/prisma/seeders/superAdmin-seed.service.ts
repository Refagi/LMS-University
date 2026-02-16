import prisma from '@/../prisma/client'
import { logger } from '@/config/logger'
import { Role } from '@/generated/prisma/client'

export class SuperAdminSeedService {
  private readonly email: string
  private readonly password: string

  constructor(email: string, password: string) {
    this.email = email
    this.password = password
  }

  public async execute(): Promise<void> {
    const existing = await prisma.user.findUnique({
      where: { email: this.email, role: Role.SUPER_ADMIN }
    })

    if (existing) {
      logger.info('SUPER_ADMIN already exists')
      return
    }

    const hashedPassword = await this.hashPassword(this.password)
    await prisma.user.upsert({
        where: { email: this.email, role: Role.SUPER_ADMIN },
        update: {},
        create: {
          email: this.email,
          password: hashedPassword,
          role: Role.SUPER_ADMIN,
          isEmailVerified: true,
          status: 'ACTIVE'}
    })
    logger.info('SUPER_ADMIN created successfully');
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await Bun.password.hash(password, {algorithm: 'bcrypt', cost: 10})
    return salt; 
 }
}
