import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { IController } from "../protocols/IController";
import { CreateServiceOrderUseCase } from "../../usecases/serviceOrder/CreateServiceOrderUseCase";
import { CreateServiceOrder } from "../../models/interfaces/serviceOrder/serviceOrderRequest";

@injectable()
class CreateServiceOrderController implements IController {
  constructor(
    @inject(CreateServiceOrderUseCase) private createServiceOrderUseCase: CreateServiceOrderUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { equipment, accessories, complaint, customerId, status, serialNumber, underWarranty, condition, description }: CreateServiceOrder = req.body;

      if (!customerId) {
        res.status(400).send({ error: 'Um cliente válido é necessário para criar uma ordem de serviço.' });
        return;
      }

      const serviceOrder = await this.createServiceOrderUseCase.execute({ 
        equipment, accessories, complaint, customerId, status, serialNumber, underWarranty, condition, description
      });

      if (serviceOrder.error) {
        res.status(400).send(serviceOrder);
      return;
      }
      
      res.json(serviceOrder);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
}

export { CreateServiceOrderController }
