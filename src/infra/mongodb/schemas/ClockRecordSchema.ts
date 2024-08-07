// src/infra/schemas/ClockRecordSchema.ts
import { Schema, model, Document } from 'mongoose';

export interface IClockRecord extends Document {
  userId: string;
  clockIn: Date;
  clockOut?: Date;
  lunchBreakStart?: Date;
  lunchBreakEnd?: Date;
  createdAt: Date;
}

const ClockRecordSchema = new Schema<IClockRecord>({
  userId: { type: String, required: true },
  clockIn: { type: Date, required: true },
  clockOut: { type: Date },
  lunchBreakStart: { type: Date },
  lunchBreakEnd: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export const ClockRecord = model<IClockRecord>('ClockRecord', ClockRecordSchema);
