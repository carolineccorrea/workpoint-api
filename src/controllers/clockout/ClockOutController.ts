import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { IController } from "../protocols/IController";
import { UpdateClockOutUseCase } from "../../usecases/clockOut/UpdateClockoutUseCase";

@injectable()
class ClockOutController implements IController {
  constructor(
    @inject('UpdateClockOutUseCase') private updateClockOutUseCase: UpdateClockOutUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.body;
    try {
      const clockOutRecord = await this.updateClockOutUseCase.execute(userId);
      res.status(200).json(clockOutRecord);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export { ClockOutController };
