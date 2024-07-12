import { ClockInRequest } from "../../models/interfaces/clockIn/clockInRequest";
import { ClockOutRequest } from "../../models/interfaces/clockOut/clockOutRequest";
import { LunchBreakStartRequest } from "../../models/interfaces/lunchBreak/LunchBreakStartRequest";
import { LunchBreakEndRequest } from "../../models/interfaces/lunchEnd/LunchEndRequest";
import prismaClient from "../../prisma";

class ClockRepository {
  async createClockIn({ userId, clockIn }: ClockInRequest) {
    if (!userId || !clockIn) {
      throw new Error("User ID and clock-in time are required");
    }

    // Verificar se o usuário existe
    const userExists = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new Error("User not found");
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
        lunchBreakId: true,
        createdAt: true,
      },
    });

    return clockInRecord;
  }

  async updateClockOut({ userId, clockOut }: ClockOutRequest) {
    if (!userId || !clockOut) {
      throw new Error("User ID and clock-out time are required");
    }

    // Verificar se o usuário existe
    const userExists = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new Error("User not found");
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

    const lunchBreakRecord = await prismaClient.lunchBreak.findFirst({
      where: {
        userId,
        lunchBreakStart: {
          gte: clockInRecord.clockIn,
          lte: new Date(),
        },
      },
      orderBy: {
        lunchBreakStart: 'desc',
      },
    });

    if (!lunchBreakRecord || !lunchBreakRecord.lunchBreakEnd) {
      throw new Error("Cannot clock out without a completed lunch break");
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
        lunchBreakId: true,
        createdAt: true,
      },
    });

    return updatedClockOutRecord;
  }

  async createLunchBreakStart({ userId, lunchBreakStart }: LunchBreakStartRequest) {
    if (!userId || !lunchBreakStart) {
      throw new Error("User ID and lunch break start time are required");
    }

    // Verificar se o usuário existe
    const userExists = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new Error("User not found");
    }

    const lunchBreakRecord = await prismaClient.lunchBreak.create({
      data: {
        userId,
        lunchBreakStart,
      },
      select: {
        id: true,
        userId: true,
        lunchBreakStart: true,
        lunchBreakEnd: true,
        createdAt: true,
      },
    });

    return lunchBreakRecord;
  }

  async updateLunchBreakEnd({ userId, lunchBreakEnd }: LunchBreakEndRequest) {
    if (!userId || !lunchBreakEnd) {
      throw new Error("User ID and lunch break end time are required");
    }

    // Verificar se o usuário existe
    const userExists = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new Error("User not found");
    }

    const lunchBreakRecord = await prismaClient.lunchBreak.findFirst({
      where: {
        userId,
        lunchBreakEnd: null,
      },
      orderBy: {
        lunchBreakStart: 'desc',
      },
    });

    if (!lunchBreakRecord) {
      throw new Error("No active lunch break start record found for user");
    }

    const updatedLunchBreakRecord = await prismaClient.lunchBreak.update({
      where: {
        id: lunchBreakRecord.id,
      },
      data: {
        lunchBreakEnd,
      },
      select: {
        id: true,
        userId: true,
        lunchBreakStart: true,
        lunchBreakEnd: true,
        createdAt: true,
      },
    });

    // Atualizar o registro de ponto com o ID do horário de almoço
    await prismaClient.clockInOut.updateMany({
      where: {
        userId,
        lunchBreakId: null,
        clockOut: null,
      },
      data: {
        lunchBreakId: updatedLunchBreakRecord.id,
      },
    });

    return updatedLunchBreakRecord;
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

  async findClockInByUserIdAndDateRange(userId: string, start: Date, end: Date) {
    return await prismaClient.clockInOut.findFirst({
      where: {
        userId,
        clockIn: {
          gte: start,
          lte: end,
        },
      },
    });
  }

  async findClockOutByUserIdAndDateRange(userId: string, start: Date, end: Date) {
    return await prismaClient.clockInOut.findFirst({
      where: {
        userId,
        clockOut: {
          gte: start,
          lte: end,
        },
      },
    });
  }

  async findLunchBreakStartByUserIdAndDateRange(userId: string, start: Date, end: Date) {
    return await prismaClient.lunchBreak.findFirst({
      where: {
        userId,
        lunchBreakStart: {
          gte: start,
          lte: end,
        },
      },
    });
  }

  async findLunchBreakEndByUserIdAndDateRange(userId: string, start: Date, end: Date) {
    return await prismaClient.lunchBreak.findFirst({
      where: {
        userId,
        lunchBreakEnd: {
          gte: start,
          lte: end,
        },
      },
    });
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
        lunchBreak: {
          select: {
            lunchBreakStart: true,
            lunchBreakEnd: true,
          },
        },
      },
    });

    const lunchBreakRecords = await prismaClient.lunchBreak.findMany({
      where: {
        userId,
      },
      orderBy: {
        lunchBreakStart: 'asc',
      },
      select: {
        lunchBreakStart: true,
        lunchBreakEnd: true,
      },
    });

    const userName = clockRecords.length > 0 ? clockRecords[0].user.name : null;

    // Agrupar os registros por dia
    const groupedRecords = clockRecords.reduce((acc, record) => {
      const dateKey = record.clockIn.toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = {
          clockInsOuts: [],
          lunchBreaks: [],
        };
      }
      acc[dateKey].clockInsOuts.push({
        clockIn: record.clockIn,
        clockOut: record.clockOut,
        lunchBreak: record.lunchBreak,
      });
      return acc;
    }, {});

    lunchBreakRecords.forEach(record => {
      const dateKey = record.lunchBreakStart.toISOString().split('T')[0];
      if (!groupedRecords[dateKey]) {
        groupedRecords[dateKey] = {
          clockInsOuts: [],
          lunchBreaks: [],
        };
      }
      groupedRecords[dateKey].lunchBreaks.push({
        lunchBreakStart: record.lunchBreakStart,
        lunchBreakEnd: record.lunchBreakEnd,
      });
    });

    return {
      userId,
      name: userName,
      records: groupedRecords,
    };
  }

  async findUserById(userId: string) {
    return await prismaClient.user.findUnique({
      where: { id: userId },
    });
  }
}

export { ClockRepository };
