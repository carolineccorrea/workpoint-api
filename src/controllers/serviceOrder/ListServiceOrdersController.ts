import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { IController } from "../protocols/IController";
import { ListServiceOrderUseCase } from "../../usecases/serviceOrder/ListServiceOrdersUseCase";

@injectable()
class ListServiceOrdersController implements IController {
  constructor(
    @inject(ListServiceOrderUseCase) private listServiceOrderUseCase: ListServiceOrderUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const serviceOrders = await this.listServiceOrderUseCase.execute()
      res.json(serviceOrders)

    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
}

export { ListServiceOrdersController }
