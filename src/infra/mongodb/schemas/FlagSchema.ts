// src/infra/schemas/FlagSchema.ts
import { Schema, model, Document } from 'mongoose';

export interface IFlag extends Document {
  name: string;
  type: string;
  value: any;
  createdAt: Date;
  updatedAt: Date;
}

const FlagSchema = new Schema<IFlag>({
  name: { type: String, unique: true, required: true },
  type: { type: String, required: true },
  value: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Flag = model<IFlag>('Flag', FlagSchema);
