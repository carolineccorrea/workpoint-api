// src/infra/repositories/FlagRepository.ts
import { injectable } from 'tsyringe';
import { Flag, IFlag } from '../schemas/FlagSchema';

@injectable()
class FlagRepository {
  async getAllFlags(): Promise<IFlag[]> {
    return await Flag.find();
  }

  async getFlagByName(name: string): Promise<IFlag | null> {
    return await Flag.findOne({ name });
  }

  async createFlag(name: string, type: string, value: any): Promise<IFlag> {
    return await Flag.create({ name, type, value });
  }

  async updateFlag(name: string, value: any): Promise<IFlag | null> {
    return await Flag.findOneAndUpdate({ name }, { value, updatedAt: new Date() }, { new: true });
  }

  async deleteFlag(name: string): Promise<IFlag | null> {
    return await Flag.findOneAndDelete({ name });
  }
}

export { FlagRepository };
