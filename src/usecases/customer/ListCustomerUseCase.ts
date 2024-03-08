import { injectable } from "tsyringe";
import { CustomerService } from "../../services/customer/CustomerService";
import { CustomerResponse } from "../../models/interfaces/customer/CustomerResponse";

@injectable()
export class ListCustomersUseCase {
    constructor(private customerService: CustomerService) {}

    async execute(): Promise<any> {
      try {
        return this.customerService.list()
      } catch (error) {
        return error;
      }
    }
}