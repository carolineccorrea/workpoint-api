// src/usecases/flags/ManageFlagsUseCase.ts
import { injectable, inject } from "tsyringe";
import { FlagRepository } from "../../infra/repositories/FlagsRepository";

@injectable()
class ManageFlagsUseCase {
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
}

export { ManageFlagsUseCase };
