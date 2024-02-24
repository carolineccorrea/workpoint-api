import { injectable } from "tsyringe";
import { CreateCustomer } from "../../models/interfaces/customer/CreateCustomer";
import { CustomerService } from "../../services/customer/CustomerService";

@injectable()
export class CreateCustomerUseCase {
  constructor(private customerService: CustomerService) {}

  async execute(customerData: CreateCustomer): Promise<any> {
    try {
      const customerExists = await this.customerService.findCustomerById(customerData.cpf)
      if (!customerExists) {
        return this.customerService.create(customerData);
      } else {
        throw new Error();
      }
    } catch (error) {
      return error;
    }
  }
}