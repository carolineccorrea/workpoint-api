import { injectable, inject } from "tsyringe";
import { DateTime } from "luxon";
import { ClockRepository } from "../../infra/postgres/repositories/ClockInOutRepository";

@injectable()
export class CheckTimeDifferenceUseCase {
  constructor(
    @inject('ClockRepository') private clockRepository: ClockRepository
  ) {}

  async execute(userId: string, currentTime: DateTime): Promise<void> {
    const TIME_RULE = 10
    const lastClockInOut = await this.clockRepository.findLastClockInOut(userId);
    if (lastClockInOut) {
      const lastClockIn = DateTime.fromJSDate(lastClockInOut.clockIn);
      const diffInMinutes = currentTime.diff(lastClockIn, 'minutes').minutes;

      if (diffInMinutes < TIME_RULE) {
        throw new Error(`Cannot clock in within ${TIME_RULE} minutes of the last clock in`);
      }
    }
  }
}
