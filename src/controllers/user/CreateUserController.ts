import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { IController } from "../protocols/IController";
import { CreateUserUseCase } from "../../usecases/users/CreateUserUseCases";

@injectable()
class CreateUserController implements IController {
  constructor(
    @inject(CreateUserUseCase) private createUserUseCase: CreateUserUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { name, email, password } = req.body
    const user = await this.createUserUseCase.execute(name, email, password);
    res.json(user);
  }
}

export { CreateUserController };
