import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { IController } from "../protocols/IController";
import { CreateLunchBreakStartUseCase } from "../../usecases/lunchBreakStart/CreateLunchBreakStartUseCase";

@injectable()
class LunchBreakStartController implements IController {
  constructor(
    @inject('CreateLunchBreakStartUseCase') private createLunchBreakStartUseCase: CreateLunchBreakStartUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.body;
    try {
      const lunchBreakRecord = await this.createLunchBreakStartUseCase.execute(userId);
      res.status(201).json(lunchBreakRecord);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export { LunchBreakStartController };
