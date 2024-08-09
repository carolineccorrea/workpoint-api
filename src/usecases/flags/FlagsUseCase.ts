// src/usecases/flags/FlagsUseCase.ts
import { injectable, inject } from "tsyringe";
import { Flag } from "../../models/interfaces/flags/Flag";
import { FlagRepository } from "../../infra/mongodb/repository/FlagRepository";
import { IFlag } from "../../infra/mongodb/schemas/FlagSchema";

@injectable()
class FlagsUseCase {
  constructor(
    @inject('FlagRepository')
    private flagRepository: FlagRepository
  ) {}

  async getAllFlags() {
    return await this.flagRepository.getAllFlags();
  }

  async getFlagByName(name: string) {
    return await this.flagRepository.getFlagByName(name);
  }

  async createFlag(name: string, type: string, value: any) {
    return await this.flagRepository.createFlag(name, type, value);
  }

  async updateFlag(name: string, value: any) {
    return await this.flagRepository.updateFlag(name, value);
  }

  async deleteFlag(name: string) {
    return await this.flagRepository.deleteFlag(name);
  }

  async getLunchTimeFlag(): Promise<IFlag> {
    const lunchTimeFlag = await this.getFlagByName("LUNCH_TIME");
    if (!lunchTimeFlag) {
      throw new Error("LUNCH_TIME flag not found");
    }
    return lunchTimeFlag;
  }

  async getLunchTimeEnforcedFlag(): Promise<IFlag> {
    const lunchTimeFlag = await this.getFlagByName("LUNCH_TIME_ENFORCED");
    if (!lunchTimeFlag) {
      throw new Error("LUNCH_TIME_ENFORCED flag not found");
    }
    return lunchTimeFlag;
  }

  async getStrictMode(): Promise<IFlag> {
    const lunchTimeFlag = await this.getFlagByName("STRICT_MODE");
    if (!lunchTimeFlag) {
      throw new Error("LUNCH_TIME_ENFORCED flag not found");
    }
    return lunchTimeFlag;
  }

}

export { FlagsUseCase };
