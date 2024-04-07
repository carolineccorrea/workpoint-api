import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { IController } from "../protocols/IController";
import { ListServiceOrderByCustomerUseCase } from "../../usecases/serviceOrder/ListServiceOrderByCustomerUseCase";

@injectable()
class ListServiceOrderByCustomerController implements IController {
  constructor(
    @inject(ListServiceOrderByCustomerUseCase) private listServiceOrderByCustomerUseCase: ListServiceOrderByCustomerUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const customerId = typeof req.query.customerId === 'string' ? req.query.customerId : undefined;
      const serviceOrders = await this.listServiceOrderByCustomerUseCase.execute(customerId)
      res.json(serviceOrders)

    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
}

export { ListServiceOrderByCustomerController }
