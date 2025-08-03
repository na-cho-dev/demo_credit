import { UserPayload } from "../interfaces/user.interface";
import { NotFoundError } from "../errors/AppError";
import { userRepository } from "../repositories/user.repository";
import { walletRepository } from "../repositories/wallet.repository";
import { Wallet } from "../interfaces/wallet.interface";

export class UserService {
  async getCurrentUser(
    userId: string
  ): Promise<{ user: UserPayload; wallet: Wallet }> {
    // Fetch user by ID
    const user = (await userRepository.findById(userId)) as UserPayload | null;
    if (!user) throw new NotFoundError("User not found");

    // Fetch wallet associated with the user
    const wallet = (await walletRepository.findByUserId(
      userId
    )) as Wallet | null;
    if (!wallet) throw new NotFoundError("Wallet not found for this user");

    return { user, wallet };
  }
}

export const userService = new UserService();
