import { CreateServiceOrder } from "../../models/interfaces/serviceOrder/serviceOrderRequest";
import prismaClient from "../../prisma";
import { injectable } from 'tsyringe';

@injectable()
class CreateServiceOrderService {
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
}

export { CreateServiceOrderService };
