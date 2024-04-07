import { injectable } from "tsyringe";
import { CategoryService } from "../../services/category/CategoryService";

@injectable()
export class CreateCategoryUseCase {
    constructor(private categoryService: CategoryService) {}

    async create(name: string): Promise<any> {
      try {
        if (name === "" || name === null || !name) {
          throw new Error("Invalid name");
        }    
        return this.categoryService.create(name);
      } catch (error) {
        return error;
      }
    }
}