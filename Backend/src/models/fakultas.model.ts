import { Prisma } from '@/generated/prisma/client';

export enum FakultasName {
    FAKULTAS_TEKNIK = 'Fakultas Teknik',
    FAKULTAS_EKONOMI_DAN_BISNIS = 'Fakultas Ekonomi dan Bisnis',
    FAKULTAS_HUKUM = 'Fakultas Hukum',
    FAKULTAS_KEDOKTERAN = 'Fakultas Kedokteran',
    FAKULTAS_ILMU_SOSIAL_DAN_ILMU_POLITIK = 'Fakultas Ilmu Sosial dan Ilmu Politik',
    FAKULTAS_PERTANIAN = 'Fakultas Pertanian',
    FAKULTAS_ILMU_KOMPUTER = 'Fakultas Ilmu Komputer',
    FAKULTAS_PSIKOLOGI = 'Fakultas Psikologi',
    FAKULTAS_KEGURUAN_DAN_ILMU_PENDIDIKAN = 'Fakultas Keguruan dan Ilmu Pendidikan',
    FAKULTAS_MATEMATIKA_DAN_ILMU_PENGETAHUAN_ALAM = 'Fakultas Matematika dan Ilmu Pengetahuan Alam',
    FAKULTAS_SENI_DAN_DESAIN = 'Fakultas Seni dan Desain',
}

export interface CreateFakultasType {
    code: string;
    name: string;
}

export type UpdateFakultasType = Partial<CreateFakultasType>;