export interface ProductSaleRequest {
  productId: string; // Changed from product_id to productId
  amount: number;
}

export interface SaleProductsRequest {
  sales: ProductSaleRequest[];
}
