import { walletRepository } from "../repositories/wallet.repository";
import { NotFoundError } from "../errors/AppError";
import { Wallet } from "../interfaces/wallet.interface";

export class WalletService {
  async createWalletForUser(userId: string): Promise<Wallet | null> {
    const wallet = (await walletRepository.create(userId)) as Wallet | null;
    return wallet;
  }

  async getWalletByUserId(userId: string): Promise<Wallet> {
    const wallet = (await walletRepository.findByUserId(
      userId
    )) as Wallet | null;
    if (!wallet) throw new NotFoundError("Wallet not found");
    return wallet;
  }

  async getWalletById(walletId: string): Promise<Wallet> {
    const wallet = (await walletRepository.findById(walletId)) as Wallet | null;
    if (!wallet) throw new NotFoundError("Wallet not found");
    return wallet;
  }

  async getWalletByEmail(email: string): Promise<Wallet> {
    const wallet = (await walletRepository.findByEmail(email)) as Wallet | null;
    if (!wallet) throw new NotFoundError("Wallet not found for email");
    return wallet;
  }
}

export const walletService = new WalletService();
