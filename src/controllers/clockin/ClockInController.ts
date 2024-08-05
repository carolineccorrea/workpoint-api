// src/controllers/ClockInController.ts
import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { IController } from "../protocols/IController";
import { CreateClockInUseCase } from "../../usecases/clockIn/CreateClockInUseCase";

@injectable()
class ClockInController implements IController {
  constructor(
    @inject('CreateClockInUseCase') private createClockInUseCase: CreateClockInUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.body;
    try {
      const clockInRecord = await this.createClockInUseCase.execute(userId);
      res.status(201).json(clockInRecord);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export { ClockInController };
