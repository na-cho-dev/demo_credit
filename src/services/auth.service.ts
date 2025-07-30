import { ConflictError, UnauthorizedError } from "../errors/AppError";
import { userRepository } from "../repositories/user.repository";
import { walletService } from "./wallet.service";

export class AuthService {
  async register(full_name: string, email: string) {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw new ConflictError("Email already in use");

    const user = await userRepository.create({
      full_name,
      email,
    });

    await walletService.createWalletForUser(user.id);

    const token = `fake-token-${user.id}`;
    return { user, token };
  }

  async login(email: string) {
    const user = await userRepository.findByEmail(email);

    if (!user) throw new UnauthorizedError("User does not exist");

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = `fake-token-${user.id}`;
    return { user, token };
  }
}

export const authService = new AuthService();
