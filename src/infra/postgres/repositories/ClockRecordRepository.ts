import { injectable } from 'tsyringe';
import prismaClient from '../../../prisma';
import { ClockRecordDTO } from '../../dtos/ClockRecordDTO';

@injectable()
class ClockRecordRepository {
  async findAllByUserIdGroupedByDay(userId: string): Promise<{ userId: string, name: string, records: Record<string, ClockRecordDTO[]> }> {
    const clockRecords = await prismaClient.clockInOut.findMany({
      where: { userId },
      orderBy: { clockIn: 'asc' },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    const lunchBreakRecords = await prismaClient.lunchBreak.findMany({
      where: { userId },
      orderBy: { lunchBreakStart: 'asc' },
    });

    const userName = clockRecords.length > 0 ? clockRecords[0].user.name : null;
    const groupedRecords: Record<string, ClockRecordDTO[]> = {};

    clockRecords.forEach(record => {
      const dateKey = record.clockIn.toISOString().split('T')[0];
      if (!groupedRecords[dateKey]) {
        groupedRecords[dateKey] = [];
      }
      groupedRecords[dateKey].push({
        id: record.id,
        userId: record.userId,
        clockIn: record.clockIn,
        clockOut: record.clockOut,
        lunchBreakStart: null,
        lunchBreakEnd: null,
        createdAt: record.createdAt,
      });
    });

    lunchBreakRecords.forEach(record => {
      const dateKey = record.lunchBreakStart.toISOString().split('T')[0];
      if (!groupedRecords[dateKey]) {
        groupedRecords[dateKey] = [];
      }
      groupedRecords[dateKey].forEach(clockRecord => {
        if (!clockRecord.lunchBreakStart) {
          clockRecord.lunchBreakStart = record.lunchBreakStart;
        }
        if (!clockRecord.lunchBreakEnd) {
          clockRecord.lunchBreakEnd = record.lunchBreakEnd;
        }
      });
    });

    return {
      userId,
      name: userName,
      records: groupedRecords,
    };
  }
}

export { ClockRecordRepository };
