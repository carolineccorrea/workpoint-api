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
  
    /*
    if (!email && !cpf && !cnpj) {
      throw new Error("Pelo menos um identificador único (email, cpf ou cnpj) deve ser fornecido.");
    }
    */
  
    let customer = null;
    
    // Tenta encontrar o cliente com base em CPF, CNPJ ou email
    if (cpf) {
      customer = await prismaClient.customer.findFirst({ where: { cpf } });
    } else if (cnpj) {
      customer = await prismaClient.customer.findFirst({ where: { cnpj } });
    } else if (email) {
      customer = await prismaClient.customer.findFirst({ where: { email } });
    }
  
    if (customer) {
      // Atualiza o cliente existente
      return prismaClient.customer.update({
        where: { id: customer.id },
        data: { name, email, cpf, cnpj },
      });
    } else {
      // Cria um novo cliente
      return prismaClient.customer.create({
        data: { name, email, cpf, cnpj },
      });
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
