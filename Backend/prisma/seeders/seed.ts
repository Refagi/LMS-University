import { SuperAdminSeedService } from './superAdmin-seed-service'
import { AdminSeedService } from './admin-seed-service'
import { MahasiswaSeedService } from './mahasiswa-seed-service'

async function main() {
  const superAdminSeed = new SuperAdminSeedService(
    'superadmin@gmail.com',
    'superadmin123#'
  )
  const adminSeed = new AdminSeedService(
    'adminsatu@gmail.com',
    'adminsatu123#'
 )
 const mahasiswaSeed = new MahasiswaSeedService(50)

  await Promise.all([
    await superAdminSeed.execute(),
    adminSeed.execute(),
    mahasiswaSeed.execute()
  ])
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