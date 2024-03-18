import prismaClient from "../../prisma/index";

class CategoryService {
  async create(name: string) {
    const category = await prismaClient.category.create({
      data: {
        name: name,
      },
      select: {
        id: true,
        name: true,
      },
    });
    return category;
  }
}

export { CategoryService };
