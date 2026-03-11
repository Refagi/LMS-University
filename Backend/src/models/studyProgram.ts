import { string } from "zod";

export enum ProgramStudyName {
    TEKNIK_ELEKTRO = 'Teknik Elektro',
    TEKNIK_MESIN = 'Teknik Mesin',
    TEKNIK_SIPIL = 'Teknik Sipil',
    TEKNIK_KIMIA = 'Teknik Kimia',
    TEKNIK_INDUSTRI = 'Teknik Industri',
    ARSITEKTUR = 'Arsitektur',
    TEKNIK_METALURGI = 'Teknik Metalurgi',

    MANAJEMEN = 'Manajemen',
    AKUNTANSI = 'Akuntansi',
    EKONOMI_PEMBANGUNAN = 'Ekonomi Pembangunan',
    MANAJEMEN_INFORMATIKA = 'Manajemen Informatika',
    ILMU_EKONOMI = 'Ilmu Ekonomi',
    BISNIS_DIGITAL = 'Bisnis Digital',

    ILMU_HUKUM = 'Ilmu Hukum',

    KEDOKTERAN_UMUM = 'Kedokteran Umum',
    KEDOKTERAN_GIGI = 'Kedokteran Gigi',
    FARMASI = 'Farmasi',

    ILMU_POLITIK = 'Ilmu Politik',
    HUBUNGAN_INTERNASIONAL = 'Hubungan Internasional',
    SOSIOLOGI = 'Sosiologi',
    ILMU_KOMUNIKASI = 'Ilmu Komunikasi',
    ADMINISTRASI_PUBLIK = 'Administrasi Publik',
    ADMINISTRASI_BISNIS = 'Administrasi Bisnis',
    ILMU_PEMERINTAHAN = 'Ilmu Pemerintahan',
    ILMU_SOSIAL = 'Ilmu Sosial',

    AGRIBISNIS = 'Agribisnis',
    AGROTEKNOLOGI = 'Agroteknologi',
    PETERNAKAN = 'Peternakan',
    TEKNOLOGI_PANGAN = 'Teknologi Pangan',
    PERIKANAN_DAN_ILMU_KELAUTAN = 'Perikanan dan Ilmu Kelautan',
    MANAJEMEN_SUMBER_DAYA_PERAIRAN = 'Manajemen Sumber Daya Perairan',

    SISTEM_INFORMASI = 'Sistem Informasi',
    TEKNIK_INFORMATIKA = 'Teknik Informatika',
    ILMU_KOMPUTER = 'Ilmu Komputer',

    PSIKOLOGI = 'Psikologi',

    PENDIDIKAN_GURU_DASAR = 'Pendidikan Guru Dasar',
    BIMBINGAN_KONSELING = 'Bimbingan Konseling',
    PENDIDIKAN_JASMANI = 'Pendidikan Jasmani',
    PENDIDIKAN_MATEMATIKA = 'Pendidikan Matematika',
    PENDIDIKAN_BIOLOGI = 'Pendidikan Biologi',
    PENDIDIKAN_KIMIA = 'Pendidikan Kimia',
    PENDIDIKAN_FISIKA = 'Pendidikan Fisika',
    PENDIDIKAN_BAHASA_INDONESIA = 'Pendidikan Bahasa Indonesia',
    PENDIDIKAN_BAHASA_INGGRIS = 'Pendidikan Bahasa Inggris',
    PENDIDIKAN_SEJARAH = 'Pendidikan Sejarah',
    PENDIDIKAN_GEOGRAFI = 'Pendidikan Geografi',
    PENDIDIKAN_EKONOMI = 'Pendidikan Ekonomi',
    PENDIDIKAN_PANCA_SILA_DAN_KWARGANEGARAAN = 'Pendidikan Panca Sila dan Kewarganegaraan',

    SENI_RUPA_MURNI = 'Seni Rupa Murni',
    DESAIN_KOMUNIKASI_VISUAL = 'Desain Komunikasi Visual',
}

export interface CreateStudyProgramType {
    code: string;
    name: string;
    facultyId: string;
    degree: string;
    accreditation: 'UNGGUL' | 'BAIK_SEKALI' | 'BAIK' | 'TIDAK_AKREDITASI';
}

export interface UpdateStudyProgramType extends Partial<Omit<CreateStudyProgramType, 'facultyId'>> { programStudyId: string }

export interface GetAllProgramStudy {
  page?: number;
  limit?: number;
  search?: string;
}
