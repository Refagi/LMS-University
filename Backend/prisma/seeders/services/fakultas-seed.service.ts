import prisma from '@/../prisma/client';
import { FakultasName } from '@/models/fakultas.model';

const facultiesData = [
  { code: 'FT', name: FakultasName.FAKULTAS_TEKNIK },
  { code: 'FEB', name: FakultasName.FAKULTAS_EKONOMI_DAN_BISNIS },
  { code: 'FH', name: FakultasName.FAKULTAS_HUKUM },
  { code: 'FK', name: FakultasName.FAKULTAS_KEDOKTERAN },
  { code: 'FISIP', name: FakultasName.FAKULTAS_ILMU_SOSIAL_DAN_ILMU_POLITIK },
  { code: 'Faperta', name: FakultasName.FAKULTAS_PERTANIAN },
  { code: 'FIK', name: FakultasName.FAKULTAS_ILMU_KOMPUTER },
  { code: 'FPSI', name: FakultasName.FAKULTAS_PSIKOLOGI },
  { code: 'FKIP', name: FakultasName.FAKULTAS_KEGURUAN_DAN_ILMU_PENDIDIKAN },
  { code: 'FMIPA', name: FakultasName.FAKULTAS_MATEMATIKA_DAN_ILMU_PENGETAHUAN_ALAM },
  { code: 'FSD', name: FakultasName.FAKULTAS_SENI_DAN_DESAIN },
];

export class FacultiesSeedService {
  public async execute(): Promise<void> {

    const existingCount = await prisma.faculty.count();

    if (existingCount === facultiesData.length) {
      console.log('All faculties already exist, skipping creation.');
      return;
    }

    const existingCodes = await prisma.faculty.findMany({
      select: { code: true },
    }).then(res => res.map(r => r.code));

    const newFaculties = facultiesData.filter(f => !existingCodes.includes(f.code));

    if (newFaculties.length === 0) {
      console.log('No new faculties to seed.');
      return;
    }

    const result = await prisma.faculty.createMany({
      data: newFaculties,
      skipDuplicates: true,
    });

    console.log(`Successfully seeded ${result.count} new faculties`);
    console.log('Faculties seeding completed.');
  }
}