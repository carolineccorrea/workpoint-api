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

      // Validação aprimorada (opcional, dependendo das regras de negócio)
      if (!cpf && !cnpj && !email) {
        res.status(400).send({ error: 'Campo CPF, CNPJ ou EMAIL deve ser preenchido.' });
        return;
      }

      // Aqui você pode adicionar validações adicionais para o formato de CPF, CNPJ e email, se necessário

      const customer = await this.createCustomerUseCase.execute({ name, email, cpf, cnpj });

      if (!customer) {
        res.status(400).json(customer.error);
      }

      res.status(201).json(customer);
    } catch (error) {
      // Melhor manipulação de erros com mais contexto
      res.status(500).send({ error: 'Erro ao criar cliente: Verifique os campos e tente novamente.'});
    }
  }
}

export { CreateCustomerController };
