// src/infra/schemas/ClockInOutSchema.ts
import { Schema, model, Document } from 'mongoose';

export interface IClockInOut extends Document {
  userId: string;
  clockIn: Date;
  clockOut?: Date;
  lunchBreakId?: string;
  createdAt: Date;
}

const ClockInOutSchema = new Schema<IClockInOut>({
  userId: { type: String, required: true, ref: 'User' },
  clockIn: { type: Date, required: true },
  clockOut: { type: Date },
  lunchBreakId: { type: String, ref: 'LunchBreak' },
  createdAt: { type: Date, default: Date.now },
});

export const ClockInOut = model<IClockInOut>('ClockInOut', ClockInOutSchema);
