// src/infra/repositories/LunchBreakRepository.ts
import { injectable } from 'tsyringe';
import { LunchBreak, ILunchBreak } from '../schemas/LunchBreakSchema';

@injectable()
class LunchBreakRepository {
  async create(lunchBreak: ILunchBreak): Promise<ILunchBreak> {
    return await LunchBreak.create(lunchBreak);
  }

  async findByUserId(userId: string): Promise<ILunchBreak[]> {
    return await LunchBreak.find({ userId }).populate('userId');
  }

  async findById(id: string): Promise<ILunchBreak | null> {
    return await LunchBreak.findById(id).populate('userId');
  }

  async update(id: string, update: Partial<ILunchBreak>): Promise<ILunchBreak | null> {
    return await LunchBreak.findByIdAndUpdate(id, update, { new: true });
  }

  async delete(id: string): Promise<ILunchBreak | null> {
    return await LunchBreak.findByIdAndDelete(id);
  }
}

export { LunchBreakRepository };
