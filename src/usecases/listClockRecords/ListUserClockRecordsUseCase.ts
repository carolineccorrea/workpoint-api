import { injectable, inject } from "tsyringe";
import { ClockRepository } from "../../infra/repositories/ClockInOutRepository";

@injectable()
export class ListUserClockRecordsUseCase {
  constructor(
    private clockRepository: ClockRepository
  ) {}

  async execute(userId: string): Promise<any> {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const clockRecords = await this.clockRepository.findAllByUserIdGroupedByDay(userId);
    return clockRecords;
  }
}
