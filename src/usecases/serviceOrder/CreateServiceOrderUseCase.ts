import { injectable, inject } from 'tsyringe';
import { CreateServiceOrder } from '../../models/interfaces/serviceOrder/serviceOrderRequest';
import { CustomerService } from '../../services/customer/CustomerService';
import { ServiceOrderService } from '../../services/serviceOrder/ServiceOrder';
import { convertToBrazilTime } from '../../utils/ConvertToBrazilTime';

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
