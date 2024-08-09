// src/infra/repositories/mongo/ClockRepository.ts
import { injectable } from 'tsyringe';
import { ClockInRequest } from '../../../models/interfaces/clockIn/clockInRequest';
import { ClockOutRequest } from '../../../models/interfaces/clockOut/clockOutRequest';
import { LunchBreakStartRequest } from '../../../models/interfaces/lunchBreak/LunchBreakStartRequest';
import { LunchBreakEndRequest } from '../../../models/interfaces/lunchEnd/LunchEndRequest';
import { ClockRecordDTO } from '../../dtos/ClockRecordDTO';
import { ClockInOut } from '../schemas/ClockInOutSchema';
import { LunchBreak } from '../schemas/LunchBreakSchema';
import { User } from '../schemas/UserSchema';

@injectable()
class ClockRepository {
  async createClockIn({ userId, clockIn }: ClockInRequest): Promise<ClockRecordDTO> {
    if (!userId || !clockIn) {
      throw new Error("User ID and clock-in time are required");
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      throw new Error("User not found");
    }

    const clockInRecord = new ClockInOut({
      userId,
      clockIn,
      createdAt: new Date(),
    });

    await clockInRecord.save();

    return {
      id: clockInRecord.id,
      userId: clockInRecord.userId,
      clockIn: clockInRecord.clockIn,
      clockOut: clockInRecord.clockOut,
      lunchBreakStart: null,
      lunchBreakEnd: null,
      createdAt: clockInRecord.createdAt,
    };
  }

  async updateClockOut({ userId, clockOut }: ClockOutRequest): Promise<ClockRecordDTO> {
    if (!userId || !clockOut) {
      throw new Error("User ID and clock-out time are required");
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      throw new Error("User not found");
    }

    const clockInRecord = await ClockInOut.findOne({ userId, clockOut: null }).sort({ clockIn: 'desc' });
    if (!clockInRecord) {
      throw new Error("No active clock-in record found for user");
    }

    const lunchBreakRecord = await LunchBreak.findOne({
      userId,
      lunchBreakStart: { $gte: clockInRecord.clockIn },
      lunchBreakEnd: { $lte: new Date() }
    }).sort({ lunchBreakStart: 'desc' });

    if (!lunchBreakRecord || !lunchBreakRecord.lunchBreakEnd) {
      throw new Error("Cannot clock out without a completed lunch break");
    }

    clockInRecord.clockOut = clockOut;
    await clockInRecord.save();

    return {
      id: clockInRecord.id,
      userId: clockInRecord.userId,
      clockIn: clockInRecord.clockIn,
      clockOut: clockInRecord.clockOut,
      lunchBreakStart: lunchBreakRecord.lunchBreakStart,
      lunchBreakEnd: lunchBreakRecord.lunchBreakEnd,
      createdAt: clockInRecord.createdAt,
    };
  }

  async createLunchBreakStart({ userId, lunchBreakStart }: LunchBreakStartRequest): Promise<ClockRecordDTO> {
    if (!userId || !lunchBreakStart) {
      throw new Error("User ID and lunch break start time are required");
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      throw new Error("User not found");
    }

    const lunchBreakRecord = new LunchBreak({
      userId,
      lunchBreakStart,
      createdAt: new Date(),
    });

    await lunchBreakRecord.save();

    const clockInRecord = await ClockInOut.findOne({ userId, clockOut: null }).sort({ clockIn: 'desc' });

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

    const userExists = await User.findById(userId);
    if (!userExists) {
      throw new Error("User not found");
    }

    const lunchBreakRecord = await LunchBreak.findOne({ userId, lunchBreakEnd: null }).sort({ lunchBreakStart: 'desc' });
    if (!lunchBreakRecord) {
      throw new Error("No active lunch break start record found for user");
    }

    lunchBreakRecord.lunchBreakEnd = lunchBreakEnd;
    await lunchBreakRecord.save();

    const clockInRecord = await ClockInOut.findOne({ userId, clockOut: null }).sort({ clockIn: 'desc' });

    await ClockInOut.updateMany({
      userId,
      lunchBreakId: null,
      clockOut: null,
    }, {
      lunchBreakId: lunchBreakRecord.id,
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

  async findLastClockInOut(userId: string): Promise<ClockRecordDTO | null> {
    const lastClockInOut = await ClockInOut.findOne({ userId }).sort({ clockIn: 'desc' }).populate('lunchBreakId');

    if (!lastClockInOut) return null;

    const lunchBreak = lastClockInOut.lunchBreakId ? await LunchBreak.findById(lastClockInOut.lunchBreakId) : null;

    return {
      id: lastClockInOut.id,
      userId: lastClockInOut.userId,
      clockIn: lastClockInOut.clockIn,
      clockOut: lastClockInOut.clockOut,
      lunchBreakStart: lunchBreak?.lunchBreakStart || null,
      lunchBreakEnd: lunchBreak?.lunchBreakEnd || null,
      createdAt: lastClockInOut.createdAt,
    };
  }

  async findClockInByUserIdAndDateRange(userId: string, start: Date, end: Date): Promise<ClockRecordDTO | null> {
    const clockInRecord = await ClockInOut.findOne({
      userId,
      clockIn: { $gte: start, $lte: end },
    }).populate('lunchBreakId');

    if (!clockInRecord) return null;

    const lunchBreak = clockInRecord.lunchBreakId ? await LunchBreak.findById(clockInRecord.lunchBreakId) : null;

    return {
      id: clockInRecord.id,
      userId: clockInRecord.userId,
      clockIn: clockInRecord.clockIn,
      clockOut: clockInRecord.clockOut,
      lunchBreakStart: lunchBreak?.lunchBreakStart || null,
      lunchBreakEnd: lunchBreak?.lunchBreakEnd || null,
      createdAt: clockInRecord.createdAt,
    };
  }

  async findClockOutByUserIdAndDateRange(userId: string, start: Date, end: Date): Promise<ClockRecordDTO | null> {
    const clockOutRecord = await ClockInOut.findOne({
      userId,
      clockOut: { $gte: start, $lte: end },
    }).populate('lunchBreakId');

    if (!clockOutRecord) return null;

    const lunchBreak = clockOutRecord.lunchBreakId ? await LunchBreak.findById(clockOutRecord.lunchBreakId) : null;

    return {
      id: clockOutRecord.id,
      userId: clockOutRecord.userId,
      clockIn: clockOutRecord.clockIn,
      clockOut: clockOutRecord.clockOut,
      lunchBreakStart: lunchBreak?.lunchBreakStart || null,
      lunchBreakEnd: lunchBreak?.lunchBreakEnd || null,
      createdAt: clockOutRecord.createdAt,
    };
  }

  async findLunchBreakStartByUserIdAndDateRange(userId: string, start: Date, end: Date): Promise<ClockRecordDTO | null> {
    const lunchBreakRecord = await LunchBreak.findOne({
      userId,
      lunchBreakStart: { $gte: start, $lte: end },
    });

    if (!lunchBreakRecord) return null;

    const clockInRecord = await ClockInOut.findOne({
      userId,
      lunchBreakId: lunchBreakRecord.id,
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
    const lunchBreakRecord = await LunchBreak.findOne({
      userId,
      lunchBreakEnd: { $gte: start, $lte: end },
    });

    if (!lunchBreakRecord) return null;

    const clockInRecord = await ClockInOut.findOne({
      userId,
      lunchBreakId: lunchBreakRecord.id,
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
    return await User.findById(userId);
  }
}

export { ClockRepository };
