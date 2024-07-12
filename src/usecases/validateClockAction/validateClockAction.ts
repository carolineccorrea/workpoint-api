import { injectable, inject } from "tsyringe";
import { DateTime } from "luxon";
import { ClockRepository } from "../../infra/repositories/ClockInOutRepository";
import { VALIDATION_FLAGS, LUNCH_TIME } from "../../flags/flags";


@injectable()
export class ValidateClockActionUseCase {
  constructor(
    private clockRepository: ClockRepository
  ) {}

  async validateClockIn(userId: string): Promise<void> {
    // Verifique se o usuário existe
    const userExists = await this.clockRepository.findUserById(userId);
    if (!userExists) {
      throw new Error("User not found");
    }

    if (VALIDATION_FLAGS.STRICT_MODE) {
      const now = DateTime.now().minus({ hours: 3 });
      const todayStart = now.startOf('day').toJSDate();
      const todayEnd = now.endOf('day').toJSDate();

      // Verifique se já existe um ponto de entrada no mesmo dia
      const clockInToday = await this.clockRepository.findClockInByUserIdAndDateRange(userId, todayStart, todayEnd);
      if (clockInToday) {
        throw new Error("Cannot clock in more than once in a day");
      }
    }
  }

  async validateLunchBreakStart(userId: string): Promise<void> {
    const now = DateTime.now().minus({ hours: 3 });
    const todayStart = now.startOf('day').toJSDate();
    const todayEnd = now.endOf('day').toJSDate();

    // Verifique se há um ponto de entrada registrado no mesmo dia
    const clockInToday = await this.clockRepository.findClockInByUserIdAndDateRange(userId, todayStart, todayEnd);
    if (!clockInToday) {
      throw new Error("Cannot start lunch break without a clock-in first");
    }

    if (VALIDATION_FLAGS.STRICT_MODE) {
      // Verifique se já existe um início de intervalo de almoço no mesmo dia
      const lunchBreakStartToday = await this.clockRepository.findLunchBreakStartByUserIdAndDateRange(userId, todayStart, todayEnd);
      if (lunchBreakStartToday) {
        throw new Error("Cannot start lunch break more than once in a day");
      }
    }
  }

  async validateLunchBreakEnd(userId: string): Promise<void> {
    const now = DateTime.now().minus({ hours: 3 });
    const todayStart = now.startOf('day').toJSDate();
    const todayEnd = now.endOf('day').toJSDate();

    // Verifique se há um início de intervalo de almoço registrado no mesmo dia
    const lunchBreakStartToday = await this.clockRepository.findLunchBreakStartByUserIdAndDateRange(userId, todayStart, todayEnd);
    if (!lunchBreakStartToday) {
      throw new Error("Cannot end lunch break without a lunch break start first");
    }

    if (VALIDATION_FLAGS.STRICT_MODE) {
      // Verifique se já existe um fim de intervalo de almoço no mesmo dia
      const lunchBreakEndToday = await this.clockRepository.findLunchBreakEndByUserIdAndDateRange(userId, todayStart, todayEnd);
      if (lunchBreakEndToday) {
        throw new Error("Cannot end lunch break more than once in a day");
      }
    }

    if (VALIDATION_FLAGS.LUNCH_TIME_ENFORCED) {
      // Verifique se o intervalo de almoço está dentro dos limites definidos
      const lunchBreakStart = DateTime.fromJSDate(lunchBreakStartToday.lunchBreakStart);
      const duration = now.diff(lunchBreakStart, 'minutes').minutes;
      if (duration < LUNCH_TIME.MIN || duration > LUNCH_TIME.MAX) {
        throw new Error(`Lunch break must be between ${LUNCH_TIME.MIN} and ${LUNCH_TIME.MAX} minutes`);
      }
    }
  }

  async validateClockOut(userId: string): Promise<void> {
    const now = DateTime.now().minus({ hours: 3 });
    const todayStart = now.startOf('day').toJSDate();
    const todayEnd = now.endOf('day').toJSDate();

    // Verifique se há um ponto de entrada registrado no mesmo dia
    const clockInToday = await this.clockRepository.findClockInByUserIdAndDateRange(userId, todayStart, todayEnd);
    if (!clockInToday) {
      throw new Error("Cannot clock out without a clock-in first");
    }

    // Verifique se há um início de intervalo de almoço registrado no mesmo dia
    const lunchBreakStartToday = await this.clockRepository.findLunchBreakStartByUserIdAndDateRange(userId, todayStart, todayEnd);
    if (!lunchBreakStartToday) {
      throw new Error("Cannot clock out without a lunch break start first");
    }

    // Verifique se há um fim de intervalo de almoço registrado no mesmo dia
    const lunchBreakEndToday = await this.clockRepository.findLunchBreakEndByUserIdAndDateRange(userId, todayStart, todayEnd);
    if (!lunchBreakEndToday) {
      throw new Error("Cannot clock out without a lunch break end first");
    }

    if (VALIDATION_FLAGS.STRICT_MODE) {
      // Verifique se já existe um ponto de saída no mesmo dia
      const clockOutToday = await this.clockRepository.findClockOutByUserIdAndDateRange(userId, todayStart, todayEnd);
      if (clockOutToday) {
        throw new Error("Cannot clock out more than once in a day");
      }
    }

    if (VALIDATION_FLAGS.LUNCH_TIME_ENFORCED) {
      // Verifique se o intervalo de almoço está dentro dos limites definidos
      const lunchBreakStart = DateTime.fromJSDate(lunchBreakStartToday.lunchBreakStart);
      const duration = DateTime.fromJSDate(lunchBreakEndToday.lunchBreakEnd).diff(lunchBreakStart, 'minutes').minutes;
      if (duration < LUNCH_TIME.MIN || duration > LUNCH_TIME.MAX) {
        throw new Error(`Lunch break must be between ${LUNCH_TIME.MIN} and ${LUNCH_TIME.MAX} minutes`);
      }
    }
  }
}
