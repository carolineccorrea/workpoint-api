import { injectable, inject } from 'tsyringe';
import { CreateServiceOrder } from '../../models/interfaces/serviceOrder/serviceOrderRequest';
import { CustomerService } from '../../services/customer/CustomerService';
import { ServiceOrderService } from '../../services/serviceOrder/ServiceOrder';
import { convertToBrazilTime } from '../../utils/ConvertToBrazilTime';
import { ServiceOrderResponse } from '../../models/interfaces/serviceOrder/ServiceOrderResponse';

@injectable()
export class CreateServiceOrderUseCase {
  constructor(
      @inject(ServiceOrderService) private serviceOrderService: ServiceOrderService,
      @inject(CustomerService) private customerService: CustomerService
  ) {}

  async execute(serviceOrderData: CreateServiceOrder): Promise<ServiceOrderResponse> {
      try {
          const customer = await this.customerService.findCustomerById(serviceOrderData.customerId);
          if (!customer) {
              throw new Error("Client ID não fornecido");
          }

          // Obtém a data e hora UTC atual
          const nowUtc = new Date();

          // Converte para o fuso horário de São Paulo
          serviceOrderData.entryDate = convertToBrazilTime(nowUtc);

          return this.serviceOrderService.execute(serviceOrderData);
      } catch (error) {
          return error;
      }
  }
}
