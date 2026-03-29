import prisma from '@/../prisma/client'
import { type ScheduleData } from '@/models/schedule.model.js'
import { faker } from '@faker-js/faker'

const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

const timeSlots = [
  { startTime: '07:00', endTime: '07:50' },
  { startTime: '07:50', endTime: '08:40' },
  { startTime: '08:40', endTime: '09:30' },
  { startTime: '09:30', endTime: '10:20' },
  { startTime: '10:20', endTime: '11:10' },
  { startTime: '11:10', endTime: '12:00' },
  { startTime: '13:00', endTime: '13:50' },
  { startTime: '13:50', endTime: '14:40' },
  { startTime: '14:40', endTime: '15:30' },
  { startTime: '15:30', endTime: '16:20' },
  { startTime: '16:20', endTime: '17:10' },
  { startTime: '17:10', endTime: '18:00' },
];

const schedulesData: ScheduleData[] = days.flatMap(day =>
  timeSlots.map(slot => ({
    day,
    startTime: slot.startTime,
    endTime: slot.endTime,
  }))
);

export class SchedulesSeedService {
  public async execute(): Promise<void> {

    const existing = await prisma.schedule.findMany({
      select: { day: true, startTime: true, endTime: true },
    });

    // unique key untuk comparison
    const existingKeys = new Set( existing.map(s => `${s.day}-${s.startTime}-${s.endTime}`));

    const newSchedules = schedulesData.filter( s => !existingKeys.has(`${s.day}-${s.startTime}-${s.endTime}`));

    if (newSchedules.length === 0) {
      console.log('No new schedules to seed.');
      return;
    }

    const result = await prisma.schedule.createMany({
      data: newSchedules,
      skipDuplicates: true,
    });

    console.log(`Successfully seeded ${result.count} new schedules.`);
    console.log(`Total schedules: ${days.length} hari x ${timeSlots.length} slot = ${schedulesData.length} jadwal.`);
    console.log('Schedules seeding completed.');
  }
}
