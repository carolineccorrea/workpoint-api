import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { IController } from "../protocols/IController";
import { LunchBreakEndUseCase } from "../../usecases/lunchBreakEnd/LunchBreakEndUseCase";


@injectable()
class LunchBreakEndController implements IController {
  constructor(
    @inject('LunchBreakEndUseCase') private updateLunchBreakEndUseCase: LunchBreakEndUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.body;
    try {
      const lunchBreakRecord = await this.updateLunchBreakEndUseCase.execute(userId);
      res.status(200).json(lunchBreakRecord);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export { LunchBreakEndController };
