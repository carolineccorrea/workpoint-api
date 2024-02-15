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

export interface SaleRequest {
  customer: CustomerSaleRequest;
  sales: ProductSaleRequest[];
}
