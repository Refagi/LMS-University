import prisma from '@/../prisma/client';
import { SemesterType } from '@/generated/prisma/client';

const semestersData = [
  // Tahun Akademik 2022/2023
  {
    name: 'Semester Ganjil 2022/2023',
    type: SemesterType.GANJIL,
    year: 2022,
    startDate: new Date('2022-09-01'),
    endDate: new Date('2023-01-31'),
    isActive: false,
  },
  {
    name: 'Semester Genap 2022/2023',
    type: SemesterType.GENAP,
    year: 2023,
    startDate: new Date('2023-02-01'),
    endDate: new Date('2023-06-30'),
    isActive: false,
  },

  // Tahun Akademik 2023/2024
  {
    name: 'Semester Ganjil 2023/2024',
    type: SemesterType.GANJIL,
    year: 2023,
    startDate: new Date('2023-09-01'),
    endDate: new Date('2024-01-31'),
    isActive: false,
  },
  {
    name: 'Semester Genap 2023/2024',
    type: SemesterType.GENAP,
    year: 2024,
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-06-30'),
    isActive: false,
  },

  // Tahun Akademik 2024/2025
  {
    name: 'Semester Ganjil 2024/2025',
    type: SemesterType.GANJIL,
    year: 2024,
    startDate: new Date('2024-09-01'),
    endDate: new Date('2025-01-31'),
    isActive: false,
  },
  {
    name: 'Semester Genap 2024/2025',
    type: SemesterType.GENAP,
    year: 2025,
    startDate: new Date('2025-02-01'),
    endDate: new Date('2025-06-30'),
    isActive: false,
  },

  // Tahun Akademik 2025/2026 — aktif sekarang
  {
    name: 'Semester Ganjil 2025/2026',
    type: SemesterType.GANJIL,
    year: 2025,
    startDate: new Date('2025-09-01'),
    endDate: new Date('2026-01-31'),
    isActive: false,
  },
  {
    name: 'Semester Genap 2025/2026',
    type: SemesterType.GENAP,
    year: 2026,
    startDate: new Date('2026-02-01'),
    endDate: new Date('2026-06-30'),
    isActive: true,
  },
];

export class SemestersSeedService {
  public async execute(): Promise<void> {

    const activeCount = semestersData.filter(s => s.isActive).length;
    if (activeCount > 1) {
      throw new Error('Hanya boleh ada 1 semester aktif dalam data seed.');
    }

    const existingNames = await prisma.semester.findMany({
      select: { name: true },
    }).then(res => res.map(r => r.name));

    const newSemesters = semestersData.filter(
      s => !existingNames.includes(s.name)
    );

    if (newSemesters.length === 0) {
      console.log('No new semesters to seed.');
      return;
    }

    const hasNewActive = newSemesters.some(s => s.isActive);
    if (hasNewActive) {
      await prisma.semester.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
      console.log('Reset isActive semua semester lama.');
    }

    const result = await prisma.semester.createMany({
      data: newSemesters,
      skipDuplicates: true,
    });

    console.log(`Successfully seeded ${result.count} new semesters.`);
    console.log('Semesters seeding completed.');
  }
}
