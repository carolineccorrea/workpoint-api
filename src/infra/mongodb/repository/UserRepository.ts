// src/infra/repositories/mongo/UserRepository.ts
import { injectable } from 'tsyringe';
import { hash } from 'bcryptjs';
import { CreateUserDTO } from '../../dtos/CreateUserDTO';
import { IUser, User } from '../schemas/UserSchema';

@injectable()
class UserRepository {
  async create({ name, email, password }: CreateUserDTO): Promise<IUser> {
    if (!email) {
      throw new Error("Email is incorrect");
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      throw new Error("Email already exists");
    }

    // Encriptando a senha do usuário
    const passwordHash = await hash(password, 8);

    // Criando o usuário
    const user = new User({
      name,
      email,
      password: passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await user.save();
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async update(id: string, update: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, update, { new: true });
  }

  async delete(id: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(id);
  }
}

export { UserRepository };
