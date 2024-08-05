// src/controllers/flag/UpdateFlagController.ts
import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import { IController } from "../protocols/IController";
import { ManageFlagsUseCase } from "../../usecases/flags/ManageFlagsUseCase";

@injectable()
class UpdateFlagController implements IController {
  constructor(
    @inject(ManageFlagsUseCase) private manageFlagsUseCase: ManageFlagsUseCase
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