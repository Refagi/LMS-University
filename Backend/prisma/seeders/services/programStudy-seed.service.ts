import prisma from '@/../prisma/client';
import { ProgramStudyName } from '@/models/studyProgram.js';
import { AccreditationType } from '@/models/fakultas.model';

const studyProgramsData = [
  // Fakultas Teknik (FT)
  { code: 'FT-310', name: ProgramStudyName.TEKNIK_ELEKTRO, facultyCode: 'FT', degree: 'S1', accreditation: AccreditationType.BAIK },
  { code: 'FT-320', name: ProgramStudyName.TEKNIK_SIPIL, facultyCode: 'FT', degree: 'S1', accreditation: AccreditationType.BAIK },
  { code: 'FT-330', name: ProgramStudyName.TEKNIK_MESIN, facultyCode: 'FT', degree: 'S1', accreditation: AccreditationType.BAIK },
  { code: 'FT-340', name: ProgramStudyName.TEKNIK_KIMIA, facultyCode: 'FT', degree: 'S1', accreditation: AccreditationType.BAIK },
  { code: 'FT-350', name: ProgramStudyName.TEKNIK_INDUSTRI, facultyCode: 'FT', degree: 'S1', accreditation: AccreditationType.BAIK_SEKALI },
  { code: 'FT-360', name: ProgramStudyName.ARSITEKTUR, facultyCode: 'FT', degree: 'S1', accreditation: AccreditationType.BAIK_SEKALI },
  { code: 'FT-370', name: ProgramStudyName.TEKNIK_METALURGI, facultyCode: 'FT', degree: 'S1', accreditation: AccreditationType.BAIK },

  // Fakultas Ekonomi dan Bisnis (FEB)
  { code: 'FEB-310', name: ProgramStudyName.AKUNTANSI, facultyCode: 'FEB', degree: 'S1', accreditation: AccreditationType.BAIK_SEKALI },
  { code: 'FEB-320', name: ProgramStudyName.MANAJEMEN, facultyCode: 'FEB', degree: 'S1', accreditation: AccreditationType.BAIK_SEKALI },
  { code: 'FEB-330', name: ProgramStudyName.EKONOMI_PEMBANGUNAN, facultyCode: 'FEB', degree: 'S1', accreditation: AccreditationType.BAIK },
  { code: 'FEB-340', name: ProgramStudyName.MANAJEMEN_INFORMATIKA, facultyCode: 'FEB', degree: 'S1', accreditation: AccreditationType.BAIK },
  { code: 'FEB-350', name: ProgramStudyName.ILMU_EKONOMI, facultyCode: 'FEB', degree: 'S1', accreditation: AccreditationType.BAIK },
  { code: 'FEB-360', name: ProgramStudyName.BISNIS_DIGITAL, facultyCode: 'FEB', degree: 'S1', accreditation: AccreditationType.BAIK },

  // Fakultas Hukum (FH)
  { code: 'FH-310', name: ProgramStudyName.ILMU_HUKUM, facultyCode: 'FH', degree: 'S1', accreditation: AccreditationType.BAIK },

  // Fakultas Kedokteran (FK)
  { code: 'FK-310', name: ProgramStudyName.KEDOKTERAN_UMUM, facultyCode: 'FK', degree: 'S1', accreditation: AccreditationType.BAIK },
  { code: 'FK-320', name: ProgramStudyName.KEDOKTERAN_GIGI, facultyCode: 'FK', degree: 'S1', accreditation: AccreditationType.BAIK },
  { code: 'FK-330', name: ProgramStudyName.FARMASI, facultyCode: 'FK', degree: 'S1', accreditation: AccreditationType.BAIK_SEKALI },

  // Fakultas Ilmu Sosial dan Ilmu Politik (FISIP)
  { code: 'FISIP-310', name: ProgramStudyName.HUBUNGAN_INTERNASIONAL, facultyCode: 'FISIP', degree: 'S1', accreditation: AccreditationType.BAIK },
  { code: 'FISIP-320', name: ProgramStudyName.ILMU_POLITIK, facultyCode: 'FISIP', degree: 'S1', accreditation: AccreditationType.BAIK },
  { code: 'FISIP-330', name: ProgramStudyName.SOSIOLOGI, facultyCode: 'FISIP', degree: 'S1', accreditation: AccreditationType.BAIK },
  { code: 'FISIP-340', name: ProgramStudyName.ILMU_KOMUNIKASI, facultyCode: 'FISIP', degree: 'S1', accreditation: AccreditationType.BAIK_SEKALI },
  { code: 'FISIP-350', name: ProgramStudyName.ADMINISTRASI_PUBLIK, facultyCode: 'FISIP', degree: 'S1', accreditation: AccreditationType.BAIK },
  { code: 'FISIP-360', name: ProgramStudyName.ADMINISTRASI_BISNIS, facultyCode: 'FISIP', degree: 'S1', accreditation: AccreditationType.BAIK },
  { code: 'FISIP-370', name: ProgramStudyName.ILMU_PEMERINTAHAN, facultyCode: 'FISIP', degree: 'S1', accreditation: AccreditationType.BAIK },
  { code: 'FISIP-380', name: ProgramStudyName.ILMU_SOSIAL, facultyCode: 'FISIP', degree: 'S1', accreditation: AccreditationType.BAIK },

  // Fakultas Pertanian (Faperta)
  { code: 'FAPERTA-310', name: ProgramStudyName.AGROTEKNOLOGI, facultyCode: 'Faperta', degree: 'S1', accreditation: AccreditationType.BAIK_SEKALI },
  { code: 'FAPERTA-320', name: ProgramStudyName.AGRIBISNIS, facultyCode: 'Faperta', degree: 'S1', accreditation: AccreditationType.BAIK },

  // Fakultas Ilmu Komputer (FIK)
  { code: 'FIK-310', name: ProgramStudyName.SISTEM_INFORMASI, facultyCode: 'FIK', degree: 'S1', accreditation: AccreditationType.UNGGUL },
  { code: 'FIK-320', name: ProgramStudyName.TEKNIK_INFORMATIKA, facultyCode: 'FIK', degree: 'S1', accreditation: AccreditationType.BAIK_SEKALI },
  { code: 'FIK-330', name: ProgramStudyName.ILMU_KOMPUTER, facultyCode: 'FIK', degree: 'S1', accreditation: AccreditationType.UNGGUL },

  // Fakultas Psikologi (FPSI)
  { code: 'FPSI-310', name: ProgramStudyName.PSIKOLOGI, facultyCode: 'FPSI', degree: 'S1', accreditation: AccreditationType.BAIK },

  // Fakultas Keguruan dan Ilmu Pendidikan (FKIP)
  { code: 'FKIP-310', name: ProgramStudyName.PENDIDIKAN_BAHASA_INDONESIA, facultyCode: 'FKIP', degree: 'S1', accreditation: AccreditationType.UNGGUL },
  { code: 'FKIP-320', name: ProgramStudyName.PENDIDIKAN_BAHASA_INGGRIS, facultyCode: 'FKIP', degree: 'S1', accreditation: AccreditationType.BAIK_SEKALI },
  { code: 'FKIP-330', name: ProgramStudyName.PENDIDIKAN_MATEMATIKA, facultyCode: 'FKIP', degree: 'S1', accreditation: AccreditationType.UNGGUL },

  // Fakultas Seni Rupa dan Desain (FSRD)
  { code: 'FSRD-310', name: ProgramStudyName.DESAIN_KOMUNIKASI_VISUAL, facultyCode: 'FSRD', degree: 'S1', accreditation: AccreditationType.BAIK },
  { code: 'FSRD-320', name: ProgramStudyName.SENI_RUPA_MURNI, facultyCode: 'FSRD', degree: 'S1', accreditation: AccreditationType.BAIK },
];

export class StudyProgramsSeedService {
  public async execute(): Promise<void> {

    const faculties = await prisma.faculty.findMany({
      select: { id: true, code: true },
    });

    if (faculties.length === 0) {
      console.log('No faculties found. Please seed faculties first.');
      return;
    }

    const facultyMap = new Map(faculties.map(f => [f.code, f.id]));

    const missingFaculties = studyProgramsData
      .map(sp => sp.facultyCode)
      .filter(code => !facultyMap.has(code));

    if (missingFaculties.length > 0) {
      console.warn(`Missing faculties for codes: ${[...new Set(missingFaculties)].join(', ')}`);
    }

    const existingCodes = await prisma.studyProgram.findMany({
      select: { code: true },
    }).then(res => res.map(r => r.code));

    const newStudyPrograms = studyProgramsData
      .filter(sp => !existingCodes.includes(sp.code) && facultyMap.has(sp.facultyCode))
      .map(({ facultyCode, ...sp }) => ({
        ...sp,
        facultyId: facultyMap.get(facultyCode)!,
      }));

    if (newStudyPrograms.length === 0) {
      console.log('No new study programs to seed.');
      return;
    }

    const result = await prisma.studyProgram.createMany({
      data: newStudyPrograms,
      skipDuplicates: true,
    });

    console.log(`Successfully seeded ${result.count} new study programs.`);
    console.log('Study programs seeding completed.');
  }
}
