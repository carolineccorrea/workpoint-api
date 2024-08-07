import { inject, injectable } from "tsyringe";
import { UserRepository } from "../../infra/mongodb/repository/UserRepository";

@injectable()
export class CreateUserUseCase {
    constructor(
      @inject('UserRepository') private userRepo: UserRepository) {}

    async execute(name: string, email: string, password: string): Promise<any> {
      try {  
        return this.userRepo.create({name, email, password});
      } catch (error) {
        return error;
      }
    }
}