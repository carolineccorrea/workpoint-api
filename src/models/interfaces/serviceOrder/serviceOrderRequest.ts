export interface CreateServiceOrder {
  equipment: string;
  accessories?: string;
  complaint: string;
  entryDate?: Date;
  status: string;
  description: string;
  serialNumber: string;
  condition: string;
  customerId: string;
  underWarranty: boolean;
  brand: string;
  model: string;
}