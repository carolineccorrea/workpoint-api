import prismaClient from "../../prisma";

class ListCustomersService {
  async execute() {
    const customers = await prismaClient.customer.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        cnpj: true
      },
    });
    return customers;
  }
}

export { ListCustomersService };