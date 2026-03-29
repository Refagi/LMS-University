import prisma from '@/../prisma/client'
import { Role, UserStatus } from '@/generated/prisma/client'
import { faker } from '@faker-js/faker'

export class DosenSeedService {
  private readonly total: number

  constructor(total: number) {
    this.total = total
  }

  public async execute(): Promise<void> {
    console.log(`Seeding ${this.total} DOSEN...`)

    const plainPassword = 'dosennih123#'
    const hashedPassword = await this.hashPassword(plainPassword)

    const mahasiswaData = Array.from({ length: this.total }).map(() => ({
      email: faker.internet.email({provider: 'gmail.com'}).toLowerCase(),
      password: hashedPassword,
      role: Role.DOSEN,
      status: UserStatus.ACTIVE ,
      isEmailVerified: true
    }))

    await prisma.user.createMany({
      data: mahasiswaData,
      skipDuplicates: true
    })

    console.log(`${this.total} MAHASISWA created`)
    console.log(`Default password: ${plainPassword}`)
  }

  private async hashPassword(password: string): Promise<string> {
    return Bun.password.hash(password, {
      algorithm: 'bcrypt',
      cost: 10
    })
  }
}
