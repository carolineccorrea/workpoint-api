import prismaClient from "../../prisma/index";

class SaleProductService {
  async findProductById(productId) {
    return prismaClient.product.findUnique({
      where: { id: productId },
    });
  }

  async updateProductAmount(productId, amount) {
    return prismaClient.product.update({
      where: { id: productId },
      data: { amount: { decrement: amount } },
    });
  }

  async executeInTransaction(work) {
    return prismaClient.$transaction(work);
  }
}

export { SaleProductService };

