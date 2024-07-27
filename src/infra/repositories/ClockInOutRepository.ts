import { ClockInRequest } from "../../models/interfaces/clockIn/clockInRequest";
import { ClockOutRequest } from "../../models/interfaces/clockOut/clockOutRequest";
import { LunchBreakStartRequest } from "../../models/interfaces/lunchBreak/LunchBreakStartRequest";
import { LunchBreakEndRequest } from "../../models/interfaces/lunchEnd/LunchEndRequest";
import prismaClient from "../../prisma";
import { ClockRecordDTO } from "../dtos/ClockRecordDTO";

class ClockRepository {
  async createClockIn({ userId, clockIn }: ClockInRequest): Promise<ClockRecordDTO> {
    if (!userId || !clockIn) {
      throw new Error("User ID and clock-in time are required");
    }

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
        lunchBreak: {
          select: {
            lunchBreakStart: true,
            lunchBreakEnd: true,
          },
        },
      },
    });

    return {
      id: clockInRecord.id,
      userId: clockInRecord.userId,
      clockIn: clockInRecord.clockIn,
      clockOut: clockInRecord.clockOut,
      lunchBreakStart: clockInRecord.lunchBreak?.lunchBreakStart || null,
      lunchBreakEnd: clockInRecord.lunchBreak?.lunchBreakEnd || null,
      createdAt: clockInRecord.createdAt,
    };
  }

  async updateClockOut({ userId, clockOut }: ClockOutRequest): Promise<ClockRecordDTO> {
    if (!userId || !clockOut) {
      throw new Error("User ID and clock-out time are required");
    }

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
        lunchBreak: {
          select: {
            lunchBreakStart: true,
            lunchBreakEnd: true,
          },
        },
      },
    });

    return {
      id: updatedClockOutRecord.id,
      userId: updatedClockOutRecord.userId,
      clockIn: updatedClockOutRecord.clockIn,
      clockOut: updatedClockOutRecord.clockOut,
      lunchBreakStart: updatedClockOutRecord.lunchBreak?.lunchBreakStart || null,
      lunchBreakEnd: updatedClockOutRecord.lunchBreak?.lunchBreakEnd || null,
      createdAt: updatedClockOutRecord.createdAt,
    };
  }

  async createLunchBreakStart({ userId, lunchBreakStart }: LunchBreakStartRequest): Promise<ClockRecordDTO> {
    if (!userId || !lunchBreakStart) {
      throw new Error("User ID and lunch break start time are required");
    }

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

    const clockInRecord = await prismaClient.clockInOut.findFirst({
      where: {
        userId,
        clockOut: null,
      },
      orderBy: {
        clockIn: 'desc',
      },
    });

    return {
      id: clockInRecord?.id || "",
      userId: lunchBreakRecord.userId,
      clockIn: clockInRecord?.clockIn || new Date(),
      clockOut: clockInRecord?.clockOut || null,
      lunchBreakStart: lunchBreakRecord.lunchBreakStart,
      lunchBreakEnd: lunchBreakRecord.lunchBreakEnd,
      createdAt: clockInRecord?.createdAt || new Date(),
    };
  }

  async updateLunchBreakEnd({ userId, lunchBreakEnd }: LunchBreakEndRequest): Promise<ClockRecordDTO> {
    if (!userId || !lunchBreakEnd) {
      throw new Error("User ID and lunch break end time are required");
    }

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

    const clockInRecord = await prismaClient.clockInOut.findFirst({
      where: {
        userId,
        clockOut: null,
      },
      orderBy: {
        clockIn: 'desc',
      },
    });

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

    return {
      id: clockInRecord?.id || "",
      userId: updatedLunchBreakRecord.userId,
      clockIn: clockInRecord?.clockIn || new Date(),
      clockOut: clockInRecord?.clockOut || null,
      lunchBreakStart: updatedLunchBreakRecord.lunchBreakStart,
      lunchBreakEnd: updatedLunchBreakRecord.lunchBreakEnd,
      createdAt: clockInRecord?.createdAt || new Date(),
    };
  }

  async findLastClockInOut(userId: string): Promise<ClockRecordDTO | null> {
    const lastClockInOut = await prismaClient.clockInOut.findFirst({
      where: { userId },
      orderBy: { clockIn: 'desc' },
      include: {
        lunchBreak: {
          select: {
            lunchBreakStart: true,
            lunchBreakEnd: true,
          },
        },
      },
    });

    if (!lastClockInOut) return null;

    return {
      id: lastClockInOut.id,
      userId: lastClockInOut.userId,
      clockIn: lastClockInOut.clockIn,
      clockOut: lastClockInOut.clockOut,
      lunchBreakStart: lastClockInOut.lunchBreak?.lunchBreakStart || null,
      lunchBreakEnd: lastClockInOut.lunchBreak?.lunchBreakEnd || null,
      createdAt: lastClockInOut.createdAt,
    };
  }

  async findClockInByUserIdAndDateRange(userId: string, start: Date, end: Date): Promise<ClockRecordDTO | null> {
    const clockInRecord = await prismaClient.clockInOut.findFirst({
      where: {
        userId,
        clockIn: { gte: start, lte: end },
      },
      include: {
        lunchBreak: {
          select: {
            lunchBreakStart: true,
            lunchBreakEnd: true,
          },
        },
      },
    });

    if (!clockInRecord) return null;

    return {
      id: clockInRecord.id,
      userId: clockInRecord.userId,
      clockIn: clockInRecord.clockIn,
      clockOut: clockInRecord.clockOut,
      lunchBreakStart: clockInRecord.lunchBreak?.lunchBreakStart || null,
      lunchBreakEnd: clockInRecord.lunchBreak?.lunchBreakEnd || null,
      createdAt: clockInRecord.createdAt,
    };
  }

  async findClockOutByUserIdAndDateRange(userId: string, start: Date, end: Date): Promise<ClockRecordDTO | null> {
    const clockOutRecord = await prismaClient.clockInOut.findFirst({
      where: {
        userId,
        clockOut: { gte: start, lte: end },
      },
      include: {
        lunchBreak: {
          select: {
            lunchBreakStart: true,
            lunchBreakEnd: true,
          },
        },
      },
    });

    if (!clockOutRecord) return null;

    return {
      id: clockOutRecord.id,
      userId: clockOutRecord.userId,
      clockIn: clockOutRecord.clockIn,
      clockOut: clockOutRecord.clockOut,
      lunchBreakStart: clockOutRecord.lunchBreak?.lunchBreakStart || null,
      lunchBreakEnd: clockOutRecord.lunchBreak?.lunchBreakEnd || null,
      createdAt: clockOutRecord.createdAt,
    };
  }

  async findLunchBreakStartByUserIdAndDateRange(userId: string, start: Date, end: Date): Promise<ClockRecordDTO | null> {
    const lunchBreakRecord = await prismaClient.lunchBreak.findFirst({
      where: {
        userId,
        lunchBreakStart: { gte: start, lte: end },
      },
    });

    if (!lunchBreakRecord) return null;

    const clockInRecord = await prismaClient.clockInOut.findFirst({
      where: {
        userId,
        lunchBreakId: lunchBreakRecord.id,
      },
    });

    return {
      id: clockInRecord?.id || "",
      userId: lunchBreakRecord.userId,
      clockIn: clockInRecord?.clockIn || new Date(),
      clockOut: clockInRecord?.clockOut || null,
      lunchBreakStart: lunchBreakRecord.lunchBreakStart,
      lunchBreakEnd: lunchBreakRecord.lunchBreakEnd,
      createdAt: clockInRecord?.createdAt || new Date(),
    };
  }

  async findLunchBreakEndByUserIdAndDateRange(userId: string, start: Date, end: Date): Promise<ClockRecordDTO | null> {
    const lunchBreakRecord = await prismaClient.lunchBreak.findFirst({
      where: {
        userId,
        lunchBreakEnd: { gte: start, lte: end },
      },
    });

    if (!lunchBreakRecord) return null;

    const clockInRecord = await prismaClient.clockInOut.findFirst({
      where: {
        userId,
        lunchBreakId: lunchBreakRecord.id,
      },
    });

    return {
      id: clockInRecord?.id || "",
      userId: lunchBreakRecord.userId,
      clockIn: clockInRecord?.clockIn || new Date(),
      clockOut: clockInRecord?.clockOut || null,
      lunchBreakStart: lunchBreakRecord.lunchBreakStart,
      lunchBreakEnd: lunchBreakRecord.lunchBreakEnd,
      createdAt: clockInRecord?.createdAt || new Date(),
    };
  }

  async findUserById(userId: string) {
    return await prismaClient.user.findUnique({
      where: { id: userId },
    });
  }
}

export { ClockRepository };
