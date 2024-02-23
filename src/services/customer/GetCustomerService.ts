// Em CustomerService.ts
import prismaClient from "../../prisma";

class GetCustomerService {
  async findCustomerById(id: string) {
    return prismaClient.customer.findUnique({ where: { id } });
  }
}

export { GetCustomerService };