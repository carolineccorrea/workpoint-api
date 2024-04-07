import { injectable, inject } from "tsyringe";
import { ServiceOrder } from "../../models/interfaces/serviceOrder/ServiceOrderResponse";
import { ServiceOrderService } from "../../services/serviceOrder/ServiceOrder";

@injectable()
export class ListServiceOrderByCustomerUseCase {
  constructor(
    @inject(ServiceOrderService) private serviceOrderService: ServiceOrderService,
  ) {}

  async execute(customerId: string): Promise<ServiceOrder[]> {
    try {
      return this.serviceOrderService.listOS(customerId);
    } catch (error) {
      return error;
    }
  }
}
