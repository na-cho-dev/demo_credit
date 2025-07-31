import {
  ConflictError,
  ForbiddenError,
  UnauthorizedError,
} from "../errors/AppError";
import { userRepository } from "../repositories/user.repository";
import { isUserBlacklisted } from "./karma.service";
import { walletService } from "./wallet.service";

export class AuthService {
  async register(full_name: string, email: string) {
    const blacklisted = await isUserBlacklisted(email);
    if (blacklisted)
      throw new ForbiddenError("User is blacklisted and cannot be onboarded");

    const existing = await userRepository.findByEmail(email);
    if (existing) throw new ConflictError("Email already in use");

    const user = await userRepository.create({
      full_name,
      email,
    });

    const wallet = await walletService.createWalletForUser(user.id);

    const token = `fake-token-${user.id}`;
    return { user, wallet, token };
  }

  async login(email: string) {
    const user = await userRepository.findByEmail(email);

    if (!user) throw new UnauthorizedError("User does not exist");

    const wallet = await walletService.getWalletByEmail(email);

    const token = `fake-token-${user.id}`;
    return { user, wallet, token };
  }
}

export const authService = new AuthService();
