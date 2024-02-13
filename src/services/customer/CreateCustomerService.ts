import { CreateCustomer } from "../../models/interfaces/customer/CreateCustomer";
import prismaClient from "../../prisma";
import { injectable } from 'tsyringe';

@injectable()
class CreateCustomerService {
  async execute({ name, email, cpf, cnpj }: CreateCustomer) {
    const customer = await prismaClient.customer.create({
      data: {
        name: name,
        email: email,
        cpf: cpf,
        cnpj: cnpj
      },
    });
    return customer;
  }
}

export { CreateCustomerService };