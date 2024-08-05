// src/infra/repositories/FlagRepository.ts
import prismaClient from "../../prisma";
import { injectable } from "tsyringe";

@injectable()
class FlagRepository {
  async getAllFlags() {
    return await prismaClient.flag.findMany();
  }

  async getFlagByName(name: string) {
    return await prismaClient.flag.findUnique({
      where: { name }
    });
  }

  async createFlag(name: string, type: string, value: any) {
    const flagAlreadyExists = await prismaClient.flag.findUnique({
      where: { name }
    });

    if (flagAlreadyExists) {
      throw new Error("Flag already exists");
    }

    return await prismaClient.flag.create({
      data: { name, type, value }
    });
  }

  async updateFlag(name: string, value: any) {
    const flag = await prismaClient.flag.findUnique({
      where: { name }
    });

    if (!flag) {
      throw new Error("Flag not found");
    }

    return await prismaClient.flag.update({
      where: { name },
      data: { value, updatedAt: new Date() }
    });
  }

  async deleteFlag(name: string) {
    const flag = await prismaClient.flag.findUnique({
      where: { name }
    });

    if (!flag) {
      throw new Error("Flag not found");
    }

    return await prismaClient.flag.delete({
      where: { name }
    });
  }
}

export { FlagRepository };
