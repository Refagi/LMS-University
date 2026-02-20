import prisma from '../client';
import { SuperAdminSeedService } from './superAdmin-seed.service';
import { AdminSeedService } from './admin-seed.service';

async function main() {
  const superAdminSeed = new SuperAdminSeedService(
    'superadmin@gmail.com',
    'superadmin@354'
  )
  const adminSeed = new AdminSeedService(
    'admin1@gmail.com',
    'admin1@354'
  )

  await superAdminSeed.execute()
  await adminSeed.execute()
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
