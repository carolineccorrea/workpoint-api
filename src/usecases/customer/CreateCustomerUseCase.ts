import { injectable } from "tsyringe";
import { CreateCustomer } from "../../models/interfaces/customer/CreateCustomer";
import { CustomerService } from "../../services/customer/CustomerService";

@injectable()
export class CreateCustomerUseCase {
  constructor(private customerService: CustomerService) {}

  async execute(customerData: CreateCustomer): Promise<any> {
    try {
      const { cpf } = customerData;

      if (cpf?.trim()) {
        const existingCustomers = await this.customerService.findCustomerByCpf(cpf);
        if (existingCustomers && existingCustomers.length > 0) {
          throw new Error("Cliente com este CPF já existe.");
        }
      }

      return await this.customerService.create(customerData);
    } catch (error) {
      throw error;
    }
  }
}
