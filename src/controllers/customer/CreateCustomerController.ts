import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { CreateCustomer } from "../../models/interfaces/customer/CreateCustomer";
import { CreateCustomerUseCase } from "../../usecases/customer/CreateCustomerUseCase";
import { IController } from "../protocols/IController";

@injectable()
class CreateCustomerController implements IController {
  constructor(
    @inject(CreateCustomerUseCase) private createCustomerUseCase: CreateCustomerUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, cpf, cnpj }: CreateCustomer = req.body;
      if (!cpf && !cnpj) {
        res.status(400).send({ error: 'Campo CPF ou CNPJ deve ser preenchido.' });
        return;
      }

      const customer = await this.createCustomerUseCase.execute({ name, email, cpf, cnpj });
      res.json(customer);
    } catch (error) {
        res.status(500).send({ error: error.message });
      }
    }
}

export { CreateCustomerController }
