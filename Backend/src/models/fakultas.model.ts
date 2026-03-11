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
    FAKULTAS_SENI_RUPA_DAN_DESAIN = 'Fakultas Seni dan Desain',
}

export enum AccreditationType {
    UNGGUL = 'UNGGUL',
    BAIK_SEKALI = 'BAIK_SEKALI',
    BAIK = 'BAIK',
    TIDAK_AKREDITASI = 'TIDAK_AKREDITASI'
}

export interface CreateFakultasType {
    code: string;
    name: string;
    accreditation: 'UNGGUL' | 'BAIK_SEKALI' | 'BAIK' | 'TIDAK_AKREDITASI';
}

export type UpdateFakultasType = Partial<CreateFakultasType> & { fakultasId: string };
