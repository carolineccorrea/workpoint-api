import { injectable } from "tsyringe";
import { CreateCustomer } from "../../models/interfaces/customer/CreateCustomer";
import { CreateCustomerService } from "../../services/customer/CreateCustomerService";

@injectable()
export class CreateCustomerUseCase {
    constructor(private customerService: CreateCustomerService) {}

    async execute(customerData: CreateCustomer): Promise<any> {
      try {
        return this.customerService.execute(customerData);
      } catch (error) {
        return error;
      }
    }
}