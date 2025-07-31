import { TransactionDto } from "../interfaces/transaction.interface";
import db from "../config/db";
import { walletRepository } from "./wallet.repository";
import { Wallet } from "../interfaces/wallet.interface";
import { Knex } from "knex";

export class TransactionRepository {
  async create(data: TransactionDto) {
    return db("transactions").insert(data);
  }

  async createWithinTrx(transaction: TransactionDto, trx: Knex.Transaction) {
    return trx("transactions").insert(transaction);
  }

  async transferWithTransaction(
    senderWallet: Wallet,
    receiverWallet: Wallet,
    transaction: TransactionDto
  ) {
    // logger.info("Sender Wallet: ", senderWallet);
    // logger.info("Receiver Wallet: ", receiverWallet);

    await db.transaction(async (trx) => {
      const senderNewBalance =
        Number(senderWallet.balance) - Number(transaction.amount);
      await walletRepository.updateBalanceWithinTrx(
        senderWallet.id,
        senderNewBalance,
        trx
      );

      const receiverNewBalance =
        Number(receiverWallet.balance) + Number(transaction.amount);
      await walletRepository.updateBalanceWithinTrx(
        receiverWallet.id,
        receiverNewBalance,
        trx
      );

      await this.createWithinTrx(transaction, trx);
    });
  }

  async getUserTransactions(
    userId: string,
    limit: number = 10,
    offset: number = 0
  ) {
    return db("transactions")
      .where("sender_id", userId)
      .orderBy("created_at", "desc")
      .limit(limit)
      .offset(offset);
  }

  async getUserTotalTransactions(userId: string) {
    const result = await db("transactions").where("sender_id", userId).count();
    const countKey = Object.keys(result[0])[0];
    return Number(result[0][countKey]);
  }
}

export const transactionRepository = new TransactionRepository();
