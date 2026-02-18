import prisma from '../client'
import { SuperAdminSeedService } from './superAdmin-seed.service'

async function main() {
  const seed = new SuperAdminSeedService(
    'superadmin@gmail.com',
    'superadmin@354'
  )

  await seed.execute()
}

main()
  .then(() => {
    console.log('Seeding finished')
    process.exit(0)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => { prisma.$disconnect()})
