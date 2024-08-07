import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { injectable } from 'tsyringe';
import { AuthUserRequest } from "../../../models/interfaces/user/AuthUserRequest";
import prismaClient from "../../../prisma";


@injectable()
class AuthRepository {
  async auth({ email, password }: AuthUserRequest) {
    if (!email) {
      throw new Error("Email precisa ser enviado!");
    }

    if (!password) {
      throw new Error("A senha precisa ser enviada!");
    }

    const user = await prismaClient.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new Error("Wrong username or password!");
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Wrong password");
    }

    const token = sign(
      {
        name: user.name,
        email: user.email,
        role: user.role, // Incluindo a role no payload do token
      },
      process.env.JWT_SECRET as string,
      {
        subject: user.id,
        expiresIn: "30d",
      }
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role, // Incluindo a role na resposta
      token: token,
    };
  }
}

export { AuthRepository };
