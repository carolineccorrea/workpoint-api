// src/controllers/flag/UpdateFlagController.ts
import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import { IController } from "../protocols/IController";
import { FlagsUseCase } from "../../usecases/flags/FlagsUseCase";

@injectable()
class UpdateFlagController implements IController {
  constructor(
    @inject(FlagsUseCase) private manageFlagsUseCase: FlagsUseCase
  ) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    const name  = req.query.name as string;
    const { value } = req.body;
    try {
      const flag = await this.manageFlagsUseCase.updateFlag(name, value);
      res.json(flag);
    } catch (error) {
      next(error);
    }
  }
}

export { UpdateFlagController };