export interface ClockRecordDTO {
  id: string;
  userId: string;
  clockIn: Date;
  clockOut: Date | null;
  lunchBreakStart: Date | null;
  lunchBreakEnd: Date | null;
  createdAt: Date;
}
