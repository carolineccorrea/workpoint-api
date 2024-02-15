import prismaClient from "../../prisma/index";

interface CustomerData {
  name: string;
  email?: string;
  cpf?: string;
  cnpj?: string;
}

class SaleProductService {
  async findProductById(productId: string) {
    return prismaClient.product.findUnique({
      where: { id: productId },
    });
  }

  async updateProductAmount(productId: string, amount: number) {
    return prismaClient.product.update({
      where: { id: productId },
      data: { amount: { decrement: amount } },
    });
  }

  async createOrUpdateCustomer(customerData: CustomerData) {
    const { name, email, cpf, cnpj } = customerData;
  
    // Validação para garantir que pelo menos um identificador único esteja presente
    if (!email && !cpf && !cnpj) {
      throw new Error("Pelo menos um identificador único (email, cpf ou cnpj) deve ser fornecido.");
    }
  
    // Define a chave de busca com base nos dados disponíveis
    let uniqueKey = cpf ? { cpf } : cnpj ? { cnpj } : { email };
  
    try {
      let customer = await prismaClient.customer.findUnique({
        where: uniqueKey,
      });
  
      if (customer) {
        return prismaClient.customer.update({
          where: { id: customer.id },
          data: { name, email, cpf, cnpj },
        });
      } else {
        return prismaClient.customer.create({
          data: { name, email, cpf, cnpj },
        });
      }
    } catch (error) {
      // Tratamento adequado de erros
      console.error("Erro ao criar ou atualizar cliente:", error);
      throw error; // ou lidar de forma mais específica com o erro
    }
  }
  

  async createOrder(customerId: string, total: number) {
    return prismaClient.order.create({
      data: {
        customer_id: customerId,
        total: total,
      },
    });
  }

  async createOrderItem(orderId: string, productId: string, quantity: number, price: number) {
    return prismaClient.orderItem.create({
      data: {
        order_id: orderId,
        product_id: productId,
        quantity: quantity,
        price: price,
      },
    });
  }

  async executeInTransaction(work: () => Promise<any>) {
    return prismaClient.$transaction(work);
  }
}

export { SaleProductService };
