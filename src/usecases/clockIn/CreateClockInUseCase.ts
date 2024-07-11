import { injectable, inject } from "tsyringe";
import { DateTime } from "luxon";
import { ClockRepository } from "../../infra/repositories/ClockInOutRepository";
import { CheckTimeDifferenceUseCase } from "../checkTime/CheckTimeDifferenceUseCase";


@injectable()
export class CreateClockInUseCase {
  constructor(
    private clockRepository: ClockRepository,
    private checkTimeDifferenceUseCase: CheckTimeDifferenceUseCase
  ) {}

  async execute(userId: string): Promise<any> {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const now = DateTime.now().minus({ hours: 3 });
      const clockIn = now.toUTC().toJSDate();

      // Verificar a diferença de tempo antes de registrar o ponto
      await this.checkTimeDifferenceUseCase.execute(userId, now);

      return await this.clockRepository.createClockIn({ userId, clockIn });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
