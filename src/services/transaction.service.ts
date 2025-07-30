import { AppError, NotFoundError } from "../errors/AppError";
import { walletService } from "./wallet.service";
import { transactionRepository } from "../repositories/transaction.repository";
import { walletRepository } from "../repositories/wallet.repository";
import { CreateTransactionDto } from "../interfaces/transaction.interface";
import { generateReference } from "../utils/reference";

export class TransactionService {
  async fundWallet(userId: string, amount: number) {
    if (!userId || !amount || amount <= 0) {
      throw new AppError("Invalid fund wallet input");
    }

    const wallet = await walletRepository.findByUserId(userId);
    if (!wallet) throw new AppError("Wallet not found");

    const newBalance = Number(wallet.balance) + amount;
    await walletRepository.updateBalance(wallet.id, newBalance);

    const transaction: CreateTransactionDto = {
      wallet_id: wallet.id,
      sender_id: null,
      receiver_id: userId,
      type: "FUND",
      amount,
      reference: generateReference(),
      status: "SUCCESS",
      metadata: {
        method: "manual-fund",
      },
    };

    await transactionRepository.create(transaction);

    return { balance: newBalance };
  }

  async withdrawFromWallet(userId: string, amount: number) {
    if (!userId || !amount || amount <= 0) {
      throw new AppError("Invalid withdraw wallet input");
    }

    const wallet = await walletRepository.findByUserId(userId);
    if (!wallet) throw new AppError("Wallet not found");

    if (Number(wallet.balance) < amount)
      throw new AppError("Insufficient wallet balance");

    const newBalance = Number(wallet.balance) - amount;
    await walletRepository.updateBalance(wallet.id, newBalance);

    const transaction: CreateTransactionDto = {
      wallet_id: wallet.id,
      sender_id: userId,
      receiver_id: null,
      type: "WITHDRAW",
      amount,
      reference: generateReference(),
      status: "SUCCESS",
      metadata: {
        method: "manual-withdrawal",
      },
    };

    await transactionRepository.create(transaction);

    return { balance: newBalance };
  }

  async transferToWallet(
    senderUserId: string,
    receiverUserId: string,
    amount: number
  ) {
    if (senderUserId === receiverUserId)
      throw new AppError("Cannot transfer to yourself");

    const senderWallet = await walletService.getWalletByUserId(senderUserId);
    const receiverWallet = await walletService.getWalletByUserId(
      receiverUserId
    );

    if (!receiverWallet) throw new NotFoundError("Receiver wallet not found");

    if (senderWallet.balance < amount) throw new AppError("Insufficient funds");

    const transaction: CreateTransactionDto = {
      wallet_id: senderWallet.id,
      sender_id: senderWallet.user_id,
      receiver_id: receiverWallet.user_id,
      type: "TRANSFER",
      amount,
      reference: generateReference(),
      status: "SUCCESS",
    };

    // Deduct from sender and add to receiver (within a transaction)
    await transactionRepository.transferWithTransaction(
      senderWallet,
      receiverWallet,
      transaction
    );

    return { transferred: amount, to: receiverUserId };
  }
}

export const transactionService = new TransactionService();
