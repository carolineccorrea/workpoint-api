import { injectable, inject } from "tsyringe";
import { CreateServiceOrder } from "../../models/interfaces/serviceOrder/serviceOrderRequest";
import { CustomerService } from "../../services/customer/CustomerService";
import { ServiceOrderService } from "../../services/serviceOrder/ServiceOrder";

@injectable()
export class CreateServiceOrderUseCase {
  constructor(
    @inject(ServiceOrderService) private serviceOrderService: ServiceOrderService,
    @inject(CustomerService) private customerService: CustomerService
  ) {}

  async execute(serviceOrderData: CreateServiceOrder): Promise<any> {
    try {
      const customer = await this.customerService.findCustomerById(serviceOrderData.customerId);
      if (!customer) {
        return { error: "Cliente não encontrado com o ID fornecido." };
      }

      return this.serviceOrderService.execute(serviceOrderData);
    } catch (error) {
      return error;
    }
  }
}
