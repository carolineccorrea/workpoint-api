import { injectable } from 'tsyringe';
import mongoose, { Schema, Types } from 'mongoose';
import { ClockRecordDTO } from '../../dtos/ClockRecordDTO';

// Verificar se os modelos já foram definidos
const ClockInOutSchema = new Schema({
  userId: { type: Types.ObjectId, required: true },
  clockIn: { type: Date, required: true },
  clockOut: { type: Date, required: true },
  createdAt: { type: Date, required: true },
});

const LunchBreakSchema = new Schema({
  userId: { type: Types.ObjectId, required: true },
  lunchBreakStart: { type: Date, required: true },
  lunchBreakEnd: { type: Date, required: true },
});

const UserSchema = new Schema({
  _id: { type: Types.ObjectId, required: true },
  name: { type: String, required: true },
});

const ClockInOutModel = mongoose.models.ClockInOut || mongoose.model('ClockInOut', ClockInOutSchema);
const LunchBreakModel = mongoose.models.LunchBreak || mongoose.model('LunchBreak', LunchBreakSchema);
const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

@injectable()
class ClockRecordRepository {
  private clockInOutModel = ClockInOutModel;
  private lunchBreakModel = LunchBreakModel;
  private userModel = UserModel;

  async findAllByUserIdGroupedByDay(userId: string): Promise<{ userId: string, name: string, records: Record<string, ClockRecordDTO[]> }> {
    const clockRecords = await this.clockInOutModel.find({ userId: new Types.ObjectId(userId) }).sort({ clockIn: 1 }).exec();
    const lunchBreakRecords = await this.lunchBreakModel.find({ userId: new Types.ObjectId(userId) }).sort({ lunchBreakStart: 1 }).exec();
    const user = await this.userModel.findOne({ _id: new Types.ObjectId(userId) }).exec();

    const userName = user ? user.name : null;
    const groupedRecords: Record<string, ClockRecordDTO[]> = {};

    clockRecords.forEach(record => {
      const dateKey = record.clockIn.toISOString().split('T')[0];
      if (!groupedRecords[dateKey]) {
        groupedRecords[dateKey] = [];
      }
      groupedRecords[dateKey].push({
        id: record._id.toString(),
        userId: record.userId.toString(),
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
