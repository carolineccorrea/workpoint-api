import { injectable } from "tsyringe";
import { SaleProductService } from "../../services/product/SaleProductService";

interface ProductSaleRequest {
  productId: string;
  amount: number;
}

interface SaleProductsRequest {
  sales: ProductSaleRequest[];
}

@injectable()
class SaleProductUseCase {
  constructor(private productService: SaleProductService) {}

  async execute({ sales }: SaleProductsRequest) {
    if (sales.length === 0) {
      throw new Error("Nenhum produto foi passado para venda!");
    }

    return this.productService.executeInTransaction(async () => {
      return Promise.all(
        sales.map(async ({ productId, amount }) => {
          if (!productId || !amount) {
            throw new Error("Dados de entrada não foram passados corretamente!");
          }

          const product = await this.productService.findProductById(productId);

          if (!product || product.amount < amount) {
            throw new Error(`Produto com ID ${productId} não tem estoque suficiente!`);
          }

          return this.productService.updateProductAmount(productId, amount);
        })
      );
    });
  }
}

export { SaleProductUseCase };
