import prisma from '../client';
import { SuperAdminSeedService } from './superAdmin-seed.service';
import { AdminSeedService } from './admin-seed.service';
import { UserSeedService } from './user-seed.service';

async function main() {
  const superAdminSeed = new SuperAdminSeedService(
    'superadmin@gmail.com',
    'superadmin@354'
  )
  const adminSeed = new AdminSeedService(
    'zambhrong33@gmail.com',
    'zambhrong@354'
  )
  const userSeed = new UserSeedService(10)


  // await superAdminSeed.execute()
  await adminSeed.execute()
  // await userSeed.execute()
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
