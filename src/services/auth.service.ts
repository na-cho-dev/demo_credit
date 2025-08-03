import { UserPayload } from "../interfaces/user.interface";
import {
  ConflictError,
  ForbiddenError,
  UnauthorizedError,
} from "../errors/AppError";
import { userRepository } from "../repositories/user.repository";
import { isUserBlacklisted } from "./karma.service";
import { walletService } from "./wallet.service";
import { Wallet } from "../interfaces/wallet.interface";

export class AuthService {
  async register(full_name: string, email: string) {
    const blacklisted = await isUserBlacklisted(email);
    if (blacklisted)
      throw new ForbiddenError("User is blacklisted and cannot be onboarded");

    const existing = (await userRepository.findByEmail(
      email
    )) as UserPayload | null;
    if (existing) throw new ConflictError("Email already in use");

    const user = (await userRepository.create({
      full_name,
      email,
    })) as UserPayload;

    const wallet = (await walletService.createWalletForUser(
      String(user.id)
    )) as Wallet;

    const token = `fake-token-${user.id}`;
    return { user, wallet, token };
  }

  async login(email: string) {
    const user = (await userRepository.findByEmail(
      email
    )) as UserPayload | null;
    if (!user) throw new UnauthorizedError("Invalid email or password");

    const wallet = (await walletService.getWalletByEmail(
      email
    )) as Wallet | null;
    if (!wallet) throw new UnauthorizedError("User wallet does not exist");

    const token = `fake-token-${user.id}`;
    return { user, wallet, token };
  }
}

export const authService = new AuthService();
