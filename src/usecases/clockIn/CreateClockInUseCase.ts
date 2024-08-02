import { injectable, inject } from "tsyringe";
import { DateTime } from "luxon";
import { ClockRepository } from "../../infra/repositories/ClockInOutRepository";
import { ValidateClockActionUseCase } from "../validateClockAction/validateClockAction";


@injectable()
export class CreateClockInUseCase {
  constructor(
    @inject('ClockRepository') private clockRepository: ClockRepository,
    @inject('ValidateClockActionUseCase') private validateClockActionUseCase: ValidateClockActionUseCase
  ) {}

  async execute(userId: string): Promise<any> {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      await this.validateClockActionUseCase.validateClockIn(userId);

      const now = DateTime.now().minus({ hours: 3 }); // Ajusta o horário para UTC-3
      const clockIn = now.toJSDate();

      return await this.clockRepository.createClockIn({ userId, clockIn });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
