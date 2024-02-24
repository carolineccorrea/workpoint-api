export interface CreateServiceOrder {
  equipment: string;
  accessories?: string; // O sinal '?' indica que este campo é opcional
  complaint: string;
  entryDate: Date;
  status: string;
  description: string;
  serialNumber: string;
  condition: string;
  customerId: string;
  underWarranty: boolean;
}