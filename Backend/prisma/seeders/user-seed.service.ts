import prisma from '@/../prisma/client'
import { logger } from '@/config/logger'
import { Role, UserStatus } from '@/generated/prisma/client'
import { faker } from '@faker-js/faker'
import { generateRandomPassword } from '@/utils/randomPass'

export class UserSeedService {
  private readonly total: number

  constructor(total: number) {
    this.total = total
  }

  public async execute(): Promise<void> {
    logger.info(`Seeding ${this.total} users...`)
    const password = generateRandomPassword(12);
    const hashedPassword = await this.hashPassword(password)
    
    const users = Array.from({ length: this.total }).map(() => ({
        email: faker.internet.email({provider: 'gmail.com'}).toLowerCase(),
        password: hashedPassword,
        role: Role.MAHASISWA,
        isEmailVerified: true,
        status: UserStatus.ACTIVE
    }))
    
    await prisma.user.createMany({
        data: users,
        skipDuplicates: true
    })

    logger.info(`${this.total} users created`)
  }

  private async hashPassword(password: string): Promise<string> {
    return Bun.password.hash(password, {
      algorithm: 'bcrypt',
      cost: 10
    })
  }
}