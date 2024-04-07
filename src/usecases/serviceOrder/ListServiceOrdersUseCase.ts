import { injectable, inject } from "tsyringe";
import { ServiceOrder } from "../../models/interfaces/serviceOrder/ServiceOrderResponse";
import { ServiceOrderService } from "../../services/serviceOrder/ServiceOrder";

@injectable()
export class ListServiceOrderUseCase {
  constructor(
    @inject(ServiceOrderService) private serviceOrderService: ServiceOrderService,
  ) {}

  async execute(): Promise<ServiceOrder[]> {
    try {
      return this.serviceOrderService.list();
    } catch (error) {
      return error;
    }
  }
}
