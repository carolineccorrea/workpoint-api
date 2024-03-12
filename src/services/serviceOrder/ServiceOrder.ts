import { ServiceOrder } from "../../models/interfaces/serviceOrder/ServiceOrder";
import { CreateServiceOrder } from "../../models/interfaces/serviceOrder/serviceOrderRequest";
import prismaClient from "../../prisma";
import { injectable } from 'tsyringe';

@injectable()
class ServiceOrderService {
  async execute({
    equipment, accessories, complaint, entryDate, status, description, 
    serialNumber, condition, customerId, underWarranty
  }: CreateServiceOrder) {
    const serviceOrder = await prismaClient.serviceOrder.create({
      data: {
        equipment: equipment,
        accessories: accessories,
        complaint: complaint,
        entryDate: new Date(entryDate),
        status: status,
        description: description,
        serialNumber: serialNumber,
        condition: condition,
        customerId: customerId,
        underWarranty: underWarranty
      },
    });
    return serviceOrder;
  }

  async list(): Promise<ServiceOrder[]>{
    const os = await prismaClient.serviceOrder.findMany({
      select: {
        equipment: true,
        accessories: true,
        complaint: true,
        entryDate: true,
        status: true,
        description: true,
        serialNumber: true,
        condition: true,
        customerId: true,
        underWarranty: true
      }
    })
    return os
  }

  async listOS(customerId?: string): Promise<ServiceOrder[]> {
    return prismaClient.serviceOrder.findMany({
      where: { customerId },
    });
  }
}

export { ServiceOrderService };
