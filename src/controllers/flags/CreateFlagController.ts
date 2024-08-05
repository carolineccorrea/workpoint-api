// src/controllers/flag/CreateFlagController.ts
import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import { IController } from "../protocols/IController";
import { ManageFlagsUseCase } from "../../usecases/flags/FlagsUseCase";

@injectable()
class CreateFlagController implements IController {
  constructor(
    @inject(ManageFlagsUseCase) private manageFlagsUseCase: ManageFlagsUseCase
  ) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { name, type, value } = req.body;
    try {
      const flag = await this.manageFlagsUseCase.createFlag(name, type, value);
      res.status(201).json(flag);
    } catch (error) {
      next(error);
    }
  }
}

export { CreateFlagController };
