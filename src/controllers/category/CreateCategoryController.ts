import { Request, Response } from "express";
import { IController } from "../protocols/IController";
import { inject, injectable } from "tsyringe";
import { CreateCategoryUseCase } from "../../usecases/category/CreateCategoryUseCase";

@injectable()
class CreateCategoryController implements IController {
  constructor(
    @inject(CreateCategoryUseCase) private createCategoryUseCase: CreateCategoryUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      const category = await this.createCategoryUseCase.create(name);
      res.json(category);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
 }
}
export { CreateCategoryController };
