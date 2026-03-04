import prisma from '@/../prisma/client'
import { Role, UserStatus } from '@/generated/prisma/client'

export class SuperAdminSeedService {
  private readonly email: string
  private readonly password: string

  constructor(email: string, password: string) {
    this.email = email
    this.password = password
  }

  public async execute(): Promise<void> {
    const existing = await prisma.user.findUnique({
      where: { email: this.email }
    })

    if (existing) {
      console.log('SUPER_ADMIN already exists')
      return
    }

    const hashedPassword = await this.hashPassword(this.password)

    await prisma.user.create({
      data: {
        email: this.email,
        password: hashedPassword,
        role: Role.SUPER_ADMIN,
        status: UserStatus.ACTIVE,
        isEmailVerified: true
      }
    })

    console.log('SUPER_ADMIN created successfully')
  }

  private async hashPassword(password: string): Promise<string> {
    const hash = await Bun.password.hash(password, {
        algorithm: 'bcrypt',
        cost: 10
    })
    return hash
  }
}