import { walletRepository } from "../repositories/wallet.repository";
import { AppError } from "../errors/AppError";

export class WalletService {
  async getWalletByUserId(userId: string) {
    const wallet = await walletRepository.findByUserId(userId);
    if (!wallet) throw new AppError("Wallet not found");
    return wallet;
  }

  async createWalletForUser(userId: number) {
    return walletRepository.create(userId);
  }

  async getWalletById(walletId: string) {
    const wallet = await walletRepository.findById(walletId);
    if (!wallet) throw new AppError("Wallet not found");
    return wallet;
  }

  async getWalletByEmail(email: string) {
    const wallet = await walletRepository.findByEmail(email);
    if (!wallet) throw new AppError("Wallet not found for email");
    return wallet;
  }
}

export const walletService = new WalletService();
