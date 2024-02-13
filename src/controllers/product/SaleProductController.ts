import { Request, Response } from "express";
import { SaleProductsRequest } from "../../models/interfaces/product/SaleProductRequest";
import { inject, injectable } from "tsyringe";
import { SaleProductUseCase } from "../../usecases/product/SaleProductUseCase";

@injectable()
class SaleProductController {
  constructor(
    @inject(SaleProductUseCase) private saleProductUseCase: SaleProductUseCase
  ) {}

  async handle(request: Request, response: Response) {
    const sales: SaleProductsRequest = request.body;

    try {
      console.log("Sales request data:", request.body);
      const saleProduct = await this.saleProductUseCase.execute(sales);
      return response.json(saleProduct);
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}

export { SaleProductController };
