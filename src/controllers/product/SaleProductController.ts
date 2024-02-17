import { Request, Response } from "express";
import { SaleRequest } from "../../models/interfaces/product/SaleProductRequest";
import { inject, injectable } from "tsyringe";
import { SaleProductUseCase } from "../../usecases/product/SaleProductUseCase";
import { IController } from "../protocols/IController";

@injectable()
class SaleProductController implements IController {
  constructor(
    @inject(SaleProductUseCase) private saleProductUseCase: SaleProductUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<any> {
    const sales: SaleRequest = req.body;

    try {
      //console.log("Sales request data:", req.body);
      const saleProduct = await this.saleProductUseCase.execute(sales);
      return res.status(200).json(saleProduct);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { SaleProductController };
