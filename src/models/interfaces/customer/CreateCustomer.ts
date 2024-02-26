import { CreateServiceOrder } from "../serviceOrder/serviceOrderRequest";

export interface CreateCustomer {
  name: string;
  email?: string;
  cpf?: string;
  cnpj?: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  created_at?: Date;
  updated_at?: Date;
  orders?: any[];
  serviceOrders?: CreateServiceOrder[];

  branchCode: string;
  branchId: string;
}
