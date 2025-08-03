import { AppError, NotFoundError } from "../errors/AppError";
import { walletService } from "./wallet.service";
import { transactionRepository } from "../repositories/transaction.repository";
import { walletRepository } from "../repositories/wallet.repository";
import {
  AuditMetadata,
  TRANSACTION_METHOD,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
  TransactionDto,
} from "../interfaces/transaction.interface";
import { generateReference } from "../utils/reference";
import { Wallet } from "../interfaces/wallet.interface";

export class TransactionService {
  async fundWallet(userId: string, amount: number, audit: AuditMetadata) {
    if (!userId || !amount || amount <= 0)
      throw new AppError("Invalid fund wallet input");

    const wallet = (await walletRepository.findByUserId(
      userId
    )) as Wallet | null;
    if (!wallet) throw new NotFoundError("Wallet not found");

    const newBalance = Number(wallet.balance) + amount;
    const transaction: TransactionDto = {
      wallet_id: wallet.id,
      sender_id: null,
      receiver_id: userId,
      type: TRANSACTION_TYPE.FUND,
      amount,
      reference: generateReference(),
      status: TRANSACTION_STATUS.SUCCESS,
      balance_before: wallet.balance,
      balance_after: newBalance,
      metadata: {
        method: TRANSACTION_METHOD.MANUAL_FUND,
        initiatedBy: audit?.initiatedBy,
        ipAddress: audit?.ipAddress,
        device: audit?.device,
      },
    };

    try {
      await walletRepository.updateBalance(wallet.id, String(newBalance));
      await transactionRepository.create(transaction);
      return { balance: newBalance };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      const failedTransaction: TransactionDto = {
        ...transaction,
        status: TRANSACTION_STATUS.FAILED,
        metadata: {
          ...(transaction.metadata ?? {}),
          error: errorMessage,
          method:
            transaction.metadata?.method ?? TRANSACTION_METHOD.MANUAL_FUND,
        },
      };
      await transactionRepository.create(failedTransaction);
      throw new AppError("Funding failed: " + errorMessage);
    }
  }

  async withdrawFromWallet(
    userId: string,
    amount: number,
    audit: AuditMetadata
  ) {
    if (!userId || !amount || amount <= 0)
      throw new AppError("Invalid withdraw wallet input");

    const wallet = (await walletRepository.findByUserId(
      userId
    )) as Wallet | null;
    if (!wallet) throw new NotFoundError("Wallet not found");

    if (Number(wallet.balance) < amount)
      throw new AppError("Insufficient wallet balance");

    const newBalance = Number(wallet.balance) - amount;
    const transaction: TransactionDto = {
      wallet_id: wallet.id,
      sender_id: userId,
      receiver_id: null,
      type: TRANSACTION_TYPE.WITHDRAW,
      amount,
      reference: generateReference(),
      status: TRANSACTION_STATUS.SUCCESS,
      balance_before: wallet.balance,
      balance_after: newBalance,
      metadata: {
        method: TRANSACTION_METHOD.MANUAL_WITHDRAWAL,
        initiatedBy: audit?.initiatedBy,
        ipAddress: audit?.ipAddress,
        device: audit?.device,
      },
    };

    try {
      await walletRepository.updateBalance(wallet.id, String(newBalance));
      await transactionRepository.create(transaction);
      return { balance: newBalance };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      const failedTransaction: TransactionDto = {
        ...transaction,
        status: TRANSACTION_STATUS.FAILED,
        metadata: {
          ...(transaction.metadata ?? {}),
          error: errorMessage,
          method:
            transaction.metadata?.method ??
            TRANSACTION_METHOD.MANUAL_WITHDRAWAL,
        },
      };
      await transactionRepository.create(failedTransaction);
      throw new AppError("Withdrawal failed: " + errorMessage);
    }
  }

  async transferToWallet(
    senderUserId: string,
    receiverIdentifier: string | undefined,
    receiverType: "id" | "email",
    amount: number,
    audit: AuditMetadata
  ) {
    if (!amount || amount <= 0 || typeof amount !== "number")
      throw new AppError("Amount must be a positive number");

    if (!receiverIdentifier)
      throw new AppError("Receiver identifier is required");

    const senderWallet = await walletService.getWalletByUserId(senderUserId);

    let receiverWallet: Wallet;
    if (receiverType === "id") {
      if (senderUserId === receiverIdentifier)
        throw new AppError("Cannot transfer to yourself");

      receiverWallet =
        await walletService.getWalletByUserId(receiverIdentifier);
    } else if (receiverType === "email") {
      receiverWallet = await walletService.getWalletByEmail(receiverIdentifier);
      if (receiverWallet && receiverWallet.user_id === senderUserId)
        throw new AppError("Cannot transfer to yourself");
    } else {
      throw new AppError("Invalid receiver type");
    }

    if (!receiverWallet) throw new NotFoundError("Receiver wallet not found");
    if (senderWallet.balance < amount) throw new AppError("Insufficient funds");

    const transaction: TransactionDto = {
      wallet_id: senderWallet.id,
      sender_id: senderWallet.user_id,
      receiver_id: receiverWallet.user_id,
      type: TRANSACTION_TYPE.TRANSFER,
      amount,
      reference: generateReference(),
      status: TRANSACTION_STATUS.SUCCESS,
      balance_before: senderWallet.balance,
      balance_after: senderWallet.balance - amount,
      metadata: {
        method: TRANSACTION_METHOD.MANUAL_TRANSFER,
        initiatedBy: audit?.initiatedBy,
        ipAddress: audit?.ipAddress,
        device: audit?.device,
      },
    };

    try {
      await transactionRepository.transferWithTransaction(
        senderWallet,
        receiverWallet,
        transaction
      );
      return { transferred: amount, to: receiverIdentifier };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      // Record failed transaction
      const failedTransaction: TransactionDto = {
        ...transaction,
        status: TRANSACTION_STATUS.FAILED,
        metadata: {
          ...(transaction.metadata ?? {}),
          error: errorMessage,
          method:
            transaction.metadata?.method ?? TRANSACTION_METHOD.MANUAL_TRANSFER,
        },
      };
      await transactionRepository.create(failedTransaction);

      throw new AppError("Transaction failed: " + errorMessage);
    }
  }

  async getUserTransactions(userId: string, limit: number, offset: number) {
    try {
      if (!userId) throw new AppError("User ID is required");

      const transactions = (await transactionRepository.getUserTransactions(
        userId,
        limit,
        offset
      )) as TransactionDto[];

      if (!transactions || transactions.length === 0)
        throw new NotFoundError("No transactions found for this user");

      const total =
        await transactionRepository.getUserTotalTransactions(userId);

      return { transactions, total };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new AppError("Failed to retrieve transactions: " + errorMessage);
    }
  }
}

export const transactionService = new TransactionService();
