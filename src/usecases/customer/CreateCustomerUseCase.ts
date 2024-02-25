import { injectable } from "tsyringe";
import { CreateCustomer } from "../../models/interfaces/customer/CreateCustomer";
import { CustomerService } from "../../services/customer/CustomerService";

@injectable()
export class CreateCustomerUseCase {
  constructor(private customerService: CustomerService) {}

  async execute(customerData: CreateCustomer): Promise<any> {
    try {
      // Verifica se o CPF é diferente de vazio e se já existe no banco de dados
      if (customerData.cpf && customerData.cpf.trim() !== '') {
        const cpfExists = await this.verifyCpf(customerData.cpf);
        if (cpfExists) {
          throw new Error("Cliente com este CPF já existe.");
        }
      }

      const newCustomer = await this.customerService.create(customerData);
      return newCustomer;
    } catch (error) {
      throw error;
    }
  }

  private async verifyCpf(cpf: string): Promise<boolean> {
    const customer = await this.customerService.findCustomerByCpf(cpf);
    return !!customer;
  }
}
