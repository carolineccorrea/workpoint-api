// src/infra/database.ts
import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: 'workpoint_db',
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
  }
};
