import { Knex } from "knex";
import db from "../config/db";
import { v4 as uuidv4 } from "uuid";
import { Wallet } from "../interfaces/wallet.interface";

export class WalletRepository {
  async create(userId: string): Promise<Wallet> {
    const id = uuidv4();
    await db("wallets").insert({ id, user_id: userId, balance: 0 });
    const wallet = (await this.findById(id)) as Wallet;

    return wallet;
  }

  async findByUserId(userId: string): Promise<Wallet | null> {
    const wallet = (await db("wallets")
      .where({ user_id: userId })
      .first()) as Wallet | null;

    return wallet;
  }

  async findById(walletId: string): Promise<Wallet | null> {
    const wallet = (await db("wallets")
      .where({ id: walletId })
      .first()) as Wallet | null;

    return wallet;
  }

  async findByEmail(email: string): Promise<Wallet | null> {
    const wallet = (await db("wallets")
      .join("users", "wallets.user_id", "users.id")
      .where("users.email", email)
      .select("wallets.*")
      .first()) as Wallet | null;

    return wallet;
  }

  async updateBalance(walletId: string, newBalance: string): Promise<number> {
    return db("wallets")
      .where({ id: walletId })
      .update({ balance: newBalance });
  }

  async updateBalanceWithinTrx(
    walletId: string,
    newBalance: number,
    trx: Knex.Transaction
  ): Promise<number> {
    return trx("wallets")
      .where({ id: walletId })
      .update({ balance: newBalance });
  }
}

export const walletRepository = new WalletRepository();
