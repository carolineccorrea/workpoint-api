import { injectable, inject } from "tsyringe";
import { CreateServiceOrder } from "../../models/interfaces/serviceOrder/serviceOrderRequest";
import { CreateServiceOrderService } from "../../services/serviceOrder/CreateServiceOrderService";
import { GetCustomerService } from "../../services/customer/GetCustomerService";

@injectable()
export class CreateServiceOrderUseCase {
  constructor(
    @inject(CreateServiceOrderService) private serviceOrderService: CreateServiceOrderService,
    @inject(GetCustomerService) private customerService: GetCustomerService // Injete o CustomerService
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
