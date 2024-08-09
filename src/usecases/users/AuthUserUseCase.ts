// src/usecases/users/AuthUserUseCase.ts
import { inject, injectable } from 'tsyringe';
import { AuthRepository } from '../../infra/mongodb/repository/AuthRepository';

@injectable()
export class AuthUserUseCase {
  constructor(
    @inject('AuthRepository') private authRepo: AuthRepository
  ) {}

  async execute(email: string, password: string): Promise<any> {
    try {
      return await this.authRepo.auth({ email, password });
    } catch (error) {
      throw new Error(error);
    }
  }
}
