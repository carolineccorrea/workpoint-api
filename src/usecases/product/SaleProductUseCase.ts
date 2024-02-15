import { injectable } from "tsyringe";
import { SaleProductService } from "../../services/product/SaleProductService";

interface ProductSaleRequest {
  productId: string;
  amount: number;
}

interface CustomerSaleRequest {
  name: string;
  email?: string;
  cpf?: string;
  cnpj?: string;
}

interface SaleRequest {
  customer: CustomerSaleRequest;
  sales: ProductSaleRequest[];
}

@injectable()
class SaleProductUseCase {
  constructor(private productService: SaleProductService) {}

  async execute({ customer, sales }: SaleRequest) {
    if (sales.length === 0) {
      throw new Error("Nenhum produto foi passado para venda!");
    }

    return this.productService.executeInTransaction(async () => {
      // Cria ou atualiza o cliente
      const customerRecord = await this.productService.createOrUpdateCustomer(customer);

      // Calcula o total do pedido
      const total = await this.calculateTotal(sales);

      // Cria o pedido
      const order = await this.productService.createOrder(customerRecord.id, total);
      console.log(order)

      // Processa cada item de venda
      return Promise.all(
        sales.map(async ({ productId, amount }) => {
          this.validateProductSale(productId, amount);

          // Obtém o preço atual do produto
          const product = await this.productService.findProductById(productId);

          // Atualiza a quantidade do produto
          await this.productService.updateProductAmount(productId, amount);

          // Cria um item de pedido
          return this.productService.createOrderItem(order.id, productId, amount, Number(product.price));
        })
      );
    });
  }

  async calculateTotal(sales: ProductSaleRequest[]): Promise<number> {
    let total = 0;
    for (const sale of sales) {
      const product = await this.productService.findProductById(sale.productId);
      total += Number(product.price) * sale.amount;
    }
    return total;
  }

  async validateProductSale(productId: string, amount: number) {
    if (!productId || !amount) {
      throw new Error("Dados de entrada não foram passados corretamente!");
    }

    const product = await this.productService.findProductById(productId);

    if (!product || product.amount < amount) {
      throw new Error(`Produto com ID ${productId} não tem estoque suficiente!`);
    }
  }
}

export { SaleProductUseCase };