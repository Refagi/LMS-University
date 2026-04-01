export type ScheduleType = {
  day: string;
  startTime: string;
  endTime: string;
};

export type UpdateScheduleType = Partial<ScheduleType> & { scheduleId: string };
