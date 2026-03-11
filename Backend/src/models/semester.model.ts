import { Prisma } from '@/generated/prisma/client';

export interface CreateSemesterType {
  name: string;
  type: 'GANJIL' | 'GENAP';
  year: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface UpdateSemesterStatusType extends Pick<CreateSemesterType, 'isActive'> { semesterId: string }

export interface UpdateSemesterType extends Partial<Omit<CreateSemesterType, 'isActive'>> { semesterId: string }
