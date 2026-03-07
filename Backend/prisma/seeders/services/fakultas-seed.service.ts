import prisma from '@/../prisma/client';
import { FakultasName, AccreditationType } from '@/models/fakultas.model';

const facultiesData = [
  { code: 'FT', name: FakultasName.FAKULTAS_TEKNIK, accreditation : AccreditationType.BAIK_SEKALI},
  { code: 'FEB', name: FakultasName.FAKULTAS_EKONOMI_DAN_BISNIS, accreditation: AccreditationType.UNGGUL },
  { code: 'FH', name: FakultasName.FAKULTAS_HUKUM, accreditation: AccreditationType.BAIK },
  { code: 'FK', name: FakultasName.FAKULTAS_KEDOKTERAN, accreditation: AccreditationType.BAIK_SEKALI },
  { code: 'FISIP', name: FakultasName.FAKULTAS_ILMU_SOSIAL_DAN_ILMU_POLITIK, accreditation: AccreditationType.BAIK },
  { code: 'Faperta', name: FakultasName.FAKULTAS_PERTANIAN, accreditation: AccreditationType.BAIK_SEKALI },
  { code: 'FIK', name: FakultasName.FAKULTAS_ILMU_KOMPUTER, accreditation: AccreditationType.UNGGUL },
  { code: 'FPSI', name: FakultasName.FAKULTAS_PSIKOLOGI, accreditation: AccreditationType.BAIK },
  { code: 'FKIP', name: FakultasName.FAKULTAS_KEGURUAN_DAN_ILMU_PENDIDIKAN, accreditation: AccreditationType.UNGGUL },
  { code: 'FSRD', name: FakultasName.FAKULTAS_SENI_RUPA_DAN_DESAIN, accreditation: AccreditationType.BAIK },
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
