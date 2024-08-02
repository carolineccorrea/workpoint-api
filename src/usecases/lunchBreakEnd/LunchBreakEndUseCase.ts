import { injectable, inject } from "tsyringe";
import { DateTime } from "luxon";
import { ClockRepository } from "../../infra/repositories/ClockInOutRepository";
import { ValidateClockActionUseCase } from "../validateClockAction/validateClockAction";

@injectable()
export class LunchBreakEndUseCase {
  constructor(
    @inject('ClockRepository') private clockRepository: ClockRepository,
    @inject('ValidateClockActionUseCase') private validateClockActionUseCase: ValidateClockActionUseCase
  ) {}

  async execute(userId: string): Promise<any> {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      await this.validateClockActionUseCase.validateLunchBreakEnd(userId);

      const now = DateTime.now().minus({ hours: 3 });
      const lunchBreakEnd = now.toJSDate();
      return await this.clockRepository.updateLunchBreakEnd({ userId, lunchBreakEnd });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
