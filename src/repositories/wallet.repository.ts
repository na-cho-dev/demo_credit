import { Knex } from "knex";
import db from "../config/db";

export class WalletRepository {
  async create(userId: number) {
    return db("wallets").insert({ user_id: userId, balance: 0 });
  }

  async findByUserId(userId: string) {
    return db("wallets").where({ user_id: userId }).first();
  }

  async findById(walletId: string) {
    return db("wallets").where({ id: walletId }).first();
  }

  async findByEmail(email: string) {
    return db("wallets")
      .join("users", "wallets.user_id", "users.id")
      .where("users.email", email)
      .select("wallets.*")
      .first();
  }

  async updateBalance(walletId: number, newBalance: number) {
    return db("wallets")
      .where({ id: walletId })
      .update({ balance: newBalance });
  }

  async updateBalanceWithinTrx(
    walletId: string,
    newBalance: number,
    trx: Knex.Transaction
  ) {
    return trx("wallets")
      .where({ id: walletId })
      .update({ balance: newBalance });
  }
}

export const walletRepository = new WalletRepository();
