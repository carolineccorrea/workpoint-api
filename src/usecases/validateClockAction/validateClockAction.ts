import { injectable, inject } from "tsyringe";
import { DateTime } from "luxon";
import { FlagsUseCase } from "../flags/FlagsUseCase";
import { Flag } from "../../models/interfaces/flags/Flag";
import { ClockRepository } from "../../infra/mongodb/repository/ClockInOutRepository";

@injectable()
export class ValidateClockActionUseCase {
  
  constructor(
    @inject('ClockRepository') private clockRepository: ClockRepository,
    @inject('FlagsUseCase') private flagUseCase: FlagsUseCase
  ) {}

  private async hasClockInToday(userId: string, now: DateTime): Promise<boolean> {
    const todayStart = now.startOf('day').toJSDate();
    const todayEnd = now.endOf('day').toJSDate();
    const clockInToday = await this.clockRepository.findClockInByUserIdAndDateRange(userId, todayStart, todayEnd);
    return !!clockInToday;
  }

  private async hasLunchBreakStartToday(userId: string, now: DateTime): Promise<boolean> {
    const todayStart = now.startOf('day').toJSDate();
    const todayEnd = now.endOf('day').toJSDate();
    const lunchBreakStartToday = await this.clockRepository.findLunchBreakStartByUserIdAndDateRange(userId, todayStart, todayEnd);
    return !!lunchBreakStartToday;
  }

  private async hasLunchBreakEndToday(userId: string, now: DateTime): Promise<boolean> {
    const todayStart = now.startOf('day').toJSDate();
    const todayEnd = now.endOf('day').toJSDate();
    const lunchBreakEndToday = await this.clockRepository.findLunchBreakEndByUserIdAndDateRange(userId, todayStart, todayEnd);
    return !!lunchBreakEndToday;
  }

  async validateClockIn(userId: string): Promise<void> {
    const strictModeFlag = await this.flagUseCase.getStrictMode();

    const userExists = await this.clockRepository.findUserById(userId);
    if (!userExists) {
      throw new Error("User not found");
    }

    if (strictModeFlag.value) {
      const now = DateTime.now().minus({ hours: 3 });
      if (await this.hasClockInToday(userId, now)) {
        throw new Error("Cannot clock in more than once in a day");
      }
    }
  }

  async validateLunchBreakStart(userId: string): Promise<void> {
    const lunchTimeFlag = await this.flagUseCase.getLunchTimeFlag();
    const strictModeFlag = await this.flagUseCase.getStrictMode();
    const lunchTimeEnforcedFlag = await this.flagUseCase.getLunchTimeEnforcedFlag();

    const { MIN, MAX } = lunchTimeFlag.value;

    const now = DateTime.now().minus({ hours: 3 });

    if (!await this.hasClockInToday(userId, now)) {
      throw new Error("Cannot start lunch break without a clock-in first");
    }

    if (strictModeFlag.value) {
      if (await this.hasLunchBreakStartToday(userId, now)) {
        throw new Error("Cannot start lunch break more than once in a day");
      }
    }
  }

  async validateLunchBreakEnd(userId: string): Promise<void> {
    const lunchTimeFlag = await this.flagUseCase.getLunchTimeFlag();
    const strictModeFlag = await this.flagUseCase.getStrictMode();
    const lunchTimeEnforcedFlag = await this.flagUseCase.getLunchTimeEnforcedFlag();

    const { MIN, MAX } = lunchTimeFlag.value;

    const now = DateTime.now().minus({ hours: 3 });

    if (!await this.hasLunchBreakStartToday(userId, now)) {
      throw new Error("Cannot end lunch break without a lunch break start first");
    }

    if (strictModeFlag.value) {
      if (await this.hasLunchBreakEndToday(userId, now)) {
        throw new Error("Cannot end lunch break more than once in a day");
      }
    }

    if (lunchTimeEnforcedFlag.value) {
      const lunchBreakStartToday = await this.clockRepository.findLunchBreakStartByUserIdAndDateRange(userId, now.startOf('day').toJSDate(), now.endOf('day').toJSDate());
      const lunchBreakStart = DateTime.fromJSDate(lunchBreakStartToday.lunchBreakStart);
      const duration = now.diff(lunchBreakStart, 'minutes').minutes;
      if (duration < MIN || duration > MAX) {
        throw new Error(`Lunch break must be between ${MIN} and ${MAX} minutes`);
      }
    }
  }

  async validateClockOut(userId: string): Promise<void> {
    const lunchTimeFlag = await this.flagUseCase.getLunchTimeFlag();
    const strictModeFlag = await this.flagUseCase.getStrictMode();
    const lunchTimeEnforcedFlag = await this.flagUseCase.getLunchTimeEnforcedFlag();

    const { MIN, MAX } = lunchTimeFlag.value;

    const now = DateTime.now().minus({ hours: 3 });

    if (!await this.hasClockInToday(userId, now)) {
      throw new Error("Cannot clock out without a clock-in first");
    }

    if (!await this.hasLunchBreakStartToday(userId, now)) {
      throw new Error("Cannot clock out without a lunch break start first");
    }

    if (!await this.hasLunchBreakEndToday(userId, now)) {
      throw new Error("Cannot clock out without a lunch break end first");
    }

    if (strictModeFlag.value) {
      const todayStart = now.startOf('day').toJSDate();
      const todayEnd = now.endOf('day').toJSDate();
      const clockOutToday = await this.clockRepository.findClockOutByUserIdAndDateRange(userId, todayStart, todayEnd);
      if (clockOutToday) {
        throw new Error("Cannot clock out more than once in a day");
      }
    }

    if (lunchTimeEnforcedFlag.value) {
      const lunchBreakStartToday = await this.clockRepository.findLunchBreakStartByUserIdAndDateRange(userId, now.startOf('day').toJSDate(), now.endOf('day').toJSDate());
      const lunchBreakEndToday = await this.clockRepository.findLunchBreakEndByUserIdAndDateRange(userId, now.startOf('day').toJSDate(), now.endOf('day').toJSDate());
      const lunchBreakStart = DateTime.fromJSDate(lunchBreakStartToday.lunchBreakStart);
      const duration = DateTime.fromJSDate(lunchBreakEndToday.lunchBreakEnd).diff(lunchBreakStart, 'minutes').minutes;
      if (duration < MIN || duration > MAX) {
        throw new Error(`Lunch break must be between ${MIN} and ${MAX} minutes`);
      }
    }
  }
}
