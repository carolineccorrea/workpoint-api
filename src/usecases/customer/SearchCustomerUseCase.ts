import { injectable } from "tsyringe";
import { CustomerService } from "../../services/customer/CustomerService";

@injectable()
export class SearchCustomerUseCase {
    constructor(private customerService: CustomerService) {}

    async execute(data: string): Promise<any> {
      try {
        return this.customerService.searchCustomers(data);
      } catch (error) {
        return error;
      }
    }
}