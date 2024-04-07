// Em GetCustomerService.ts
import { CreateCustomer } from "../../models/interfaces/customer/CreateCustomer";
import prismaClient from "../../prisma";

class CustomerService {

  async list() {
    const customers = await prismaClient.customer.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        cnpj: true,
        branchCode: true,
        branchId: true
      },
    });
    return customers;
  }
  
  async create({ name, email, cpf, cnpj, branchCode, branchId }: CreateCustomer) {

    const customer = await prismaClient.customer.create({
      data: {
        name: name,
        email: email,
        cpf: cpf,
        cnpj: cnpj,
        branchCode: branchCode,
        branchId: branchId
      },
    });
    return customer;
  }

  async findCustomerByCpf(cpf: string) {
    return prismaClient.customer.findMany({
      where: { cpf },
    });
  }

  async findCustomerById(id: string) {
    return prismaClient.customer.findUnique({
      where: { id },
    });
  }

  async searchCustomers(query: string) {
    return prismaClient.customer.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            cpf: {
              equals: query,
            },
          },
        ],
      },
    });
  }
}

export { CustomerService };
