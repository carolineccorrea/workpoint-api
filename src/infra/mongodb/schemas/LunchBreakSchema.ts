// src/infra/schemas/LunchBreakSchema.ts
import { Schema, model, Document } from 'mongoose';

export interface ILunchBreak extends Document {
  userId: string;
  lunchBreakStart: Date;
  lunchBreakEnd?: Date;
  createdAt: Date;
}

const LunchBreakSchema = new Schema<ILunchBreak>({
  userId: { type: String, required: true, ref: 'User' },
  lunchBreakStart: { type: Date, required: true },
  lunchBreakEnd: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export const LunchBreak = model<ILunchBreak>('LunchBreak', LunchBreakSchema);
