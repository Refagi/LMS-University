import { SuperAdminSeedService } from './services/superAdmin-seed.service'
import { AdminSeedService } from './services/admin-seed.service'
import { MahasiswaSeedService } from './services/mahasiswa-seed.service'
import { FacultiesSeedService } from './services/fakultas-seed.service'
import { StudyProgramsSeedService } from './services/programStudy-seed.service'
import { SemestersSeedService } from './services/semester-seed.service'

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

 const fakultasSeed = new FacultiesSeedService()

 const studyProgramsSeed = new StudyProgramsSeedService()

 const semestersSeed = new SemestersSeedService()

  // await Promise.all([
  //   await superAdminSeed.execute(),
  //   adminSeed.execute(),
  //   mahasiswaSeed.execute()
  // ])
  await semestersSeed.execute()
  // await fakultasSeed.execute()
  // await studyProgramsSeed.execute()
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
