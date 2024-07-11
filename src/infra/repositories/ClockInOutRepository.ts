import { ClockInRequest } from "../../models/interfaces/clockIn/clockInRequest";
import { ClockOutRequest } from "../../models/interfaces/clockOut/clockOutRequest";
import prismaClient from "../../prisma";

class ClockRepository {
  async createClockIn({ userId, clockIn }: ClockInRequest) {
    if (!userId || !clockIn) {
      throw new Error("User ID and clock-in time are required");
    }

    const clockInRecord = await prismaClient.clockInOut.create({
      data: {
        userId,
        clockIn,
      },
      select: {
        id: true,
        userId: true,
        clockIn: true,
        clockOut: true,
        createdAt: true,
      },
    });

    return clockInRecord;
  }

  async updateClockOut({ userId, clockOut }: ClockOutRequest) {
    if (!userId || !clockOut) {
      throw new Error("User ID and clock-out time are required");
    }

    const clockInRecord = await prismaClient.clockInOut.findFirst({
      where: {
        userId,
        clockOut: null,
      },
      orderBy: {
        clockIn: 'desc',
      },
    });

    if (!clockInRecord) {
      throw new Error("No active clock-in record found for user");
    }

    const updatedClockOutRecord = await prismaClient.clockInOut.update({
      where: {
        id: clockInRecord.id,
      },
      data: {
        clockOut,
      },
      select: {
        id: true,
        userId: true,
        clockIn: true,
        clockOut: true,
        createdAt: true,
      },
    });

    return updatedClockOutRecord;
  }

  async findLastClockInOut(userId: string) {
    const lastClockInOut = await prismaClient.clockInOut.findFirst({
      where: {
        userId,
      },
      orderBy: {
        clockIn: 'desc',
      },
    });

    return lastClockInOut;
  }

  async findAllByUserIdGroupedByDay(userId: string) {
    const clockRecords = await prismaClient.clockInOut.findMany({
      where: {
        userId,
      },
      orderBy: {
        clockIn: 'asc',
      },
      select: {
        user: {
          select: {
            name: true,
          },
        },
        clockIn: true,
        clockOut: true,
      },
    });

    const userName = clockRecords.length > 0 ? clockRecords[0].user.name : null;

    // Agrupar os registros por dia
    const groupedRecords = clockRecords.reduce((acc, record) => {
      const dateKey = record.clockIn.toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push({
        clockIn: record.clockIn,
        clockOut: record.clockOut,
      });
      return acc;
    }, {});

    return {
      userId,
      name: userName,
      records: groupedRecords,
    };
  }
}

export { ClockRepository };
