import { NotFoundError } from "../errors/AppError";
import { userRepository } from "../repositories/user.repository";
import { walletRepository } from "../repositories/wallet.repository";

export class UserService {
    async getCurrentUser(userId: string) {
        // Fetch user by ID
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError("User not found");
        }

        // Fetch wallet associated with the user
        const wallet = await walletRepository.findByUserId(userId);
        if (!wallet) {
            throw new NotFoundError("Wallet not found for this user");
        }

        return { user, wallet };
    }
}

export const userService = new UserService();
