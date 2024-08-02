// src/controllers/user/AuthUserController.ts
import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { AuthUserUseCase } from '../../usecases/users/AuthUserUseCase';

@injectable()
class AuthUserController {
  constructor(
    @inject('AuthUserUseCase') private authUserUseCase: AuthUserUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    try {
      const user = await this.authUserUseCase.execute(email, password);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export { AuthUserController };
