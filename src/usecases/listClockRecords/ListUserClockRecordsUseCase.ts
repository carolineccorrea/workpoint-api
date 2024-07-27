import { injectable, inject } from "tsyringe";
import { ClockRepository } from "../../infra/repositories/ClockInOutRepository";
import { ClockRecordRepository } from "../../infra/repositories/ClockRecordRepository";

@injectable()
export class ListUserClockRecordsUseCase {
  constructor(
    private clockRepository: ClockRecordRepository
  ) {}

  async execute(userId: string): Promise<any> {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const clockRecords = await this.clockRepository.findAllByUserIdGroupedByDay(userId);
    return clockRecords;
  }
}
