import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { SearchCustomerUseCase } from "../../usecases/customer/SearchCustomerUseCase";
import { IController } from "../protocols/IController";

@injectable()
class SearchCustomerController implements IController {
  constructor(
    @inject(SearchCustomerUseCase) private searchCustomerUseCase: SearchCustomerUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      // O parâmetro 'data' pode ser um nome, CPF, ou qualquer outro identificador do cliente
      const data = req.query.data as string;

      if (!data) {
        res.status(400).send({ error: 'Dados de busca são necessários.' });
        return;
      }

      const customers = await this.searchCustomerUseCase.execute(data);

      res.json(customers);
    } catch (error) {
      res.status(500).send({ error: 'Erro ao buscar clientes: ' + error.message });
    }
  }
}

export { SearchCustomerController };
