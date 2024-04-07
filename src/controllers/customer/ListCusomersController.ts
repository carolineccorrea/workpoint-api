import { Request, Response } from "express";
import { IController } from "../protocols/IController";
import { injectable, inject } from "tsyringe";
import { SearchCustomerUseCase } from "../../usecases/customer/SearchCustomerUseCase";
import { ListCustomersUseCase } from "../../usecases/customer/ListCustomerUseCase";

@injectable()
class ListCustomersController implements IController {
  constructor(
    @inject(ListCustomersUseCase) private listCustomersUseCase: ListCustomersUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const customers = await this.listCustomersUseCase.execute()
    res.json(customers);
  }
}

export { ListCustomersController };