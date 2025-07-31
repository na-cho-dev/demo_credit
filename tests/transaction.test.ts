import { transactionService } from "../src/services/transaction.service";

// Mock wallet and transaction repositories
jest.mock("../src/repositories/wallet.repository", () => ({
  walletRepository: {
    findById: jest.fn(),
    findByUserId: jest.fn(),
    findByEmail: jest.fn(),
    updateBalance: jest.fn(),
  },
}));

jest.mock("../src/repositories/transaction.repository", () => ({
  transactionRepository: {
    create: jest.fn(),
    getUserTransactions: jest.fn(),
    getUserTotalTransactions: jest.fn(),
    transferWithTransaction: jest.fn().mockResolvedValue(true),
  },
}));

describe("Funding", () => {
  it("successfully funds wallet with valid amount", async () => {
    const {
      walletRepository,
    } = require("../src/repositories/wallet.repository");
    const {
      transactionRepository,
    } = require("../src/repositories/transaction.repository");
    walletRepository.findByUserId.mockResolvedValue({
      id: "wallet-id",
      balance: 100,
    });
    walletRepository.updateBalance.mockResolvedValue(true);
    transactionRepository.create.mockResolvedValue(true);

    const result = await transactionService.fundWallet("user-id", 50, {});
    expect(result).toHaveProperty("balance");
    expect(result.balance).toBe(150);
  });

  it("rejects funding with negative or zero amount", async () => {
    await expect(
      transactionService.fundWallet("user-id", 0, {})
    ).rejects.toThrow();
    await expect(
      transactionService.fundWallet("user-id", -10, {})
    ).rejects.toThrow();
  });

  it("rejects funding for non-existing user/wallet", async () => {
    const {
      walletRepository,
    } = require("../src/repositories/wallet.repository");
    walletRepository.findByUserId.mockResolvedValue(null);
    await expect(
      transactionService.fundWallet("user-id", 50, {})
    ).rejects.toThrow();
  });
});

describe("Withdrawal", () => {
  it("successfully withdraws with sufficient funds", async () => {
    const {
      walletRepository,
    } = require("../src/repositories/wallet.repository");
    const {
      transactionRepository,
    } = require("../src/repositories/transaction.repository");
    walletRepository.findByUserId.mockResolvedValue({
      id: "wallet-id",
      balance: 100,
    });
    walletRepository.updateBalance.mockResolvedValue(true);
    transactionRepository.create.mockResolvedValue(true);

    const result = await transactionService.withdrawFromWallet(
      "user-id",
      50,
      {}
    );
    expect(result).toHaveProperty("balance");
    expect(result.balance).toBe(50);
  });

  it("rejects withdrawal with insufficient funds", async () => {
    const {
      walletRepository,
    } = require("../src/repositories/wallet.repository");
    walletRepository.findByUserId.mockResolvedValue({
      id: "wallet-id",
      balance: 10,
    });
    await expect(
      transactionService.withdrawFromWallet("user-id", 50, {})
    ).rejects.toThrow();
  });

  it("rejects withdrawal with negative or zero amount", async () => {
    await expect(
      transactionService.withdrawFromWallet("user-id", 0, {})
    ).rejects.toThrow();
    await expect(
      transactionService.withdrawFromWallet("user-id", -10, {})
    ).rejects.toThrow();
  });

  it("rejects withdrawal for non-existing user/wallet", async () => {
    const {
      walletRepository,
    } = require("../src/repositories/wallet.repository");
    walletRepository.findByUserId.mockResolvedValue(null);
    await expect(
      transactionService.withdrawFromWallet("user-id", 50, {})
    ).rejects.toThrow();
  });
});

describe("Transfer", () => {
  it("successfully transfers funds to another user by email", async () => {
    const {
      walletRepository,
    } = require("../src/repositories/wallet.repository");
    // Mock sender wallet
    walletRepository.findByUserId.mockResolvedValue({
      id: "wallet-id",
      user_id: "sender-id",
      balance: 100,
    });
    // Mock receiver wallet by email
    walletRepository.findByEmail.mockResolvedValue({
      id: "receiver-wallet-id",
      user_id: "receiver-id",
      balance: 50,
    });
    walletRepository.updateBalance.mockResolvedValue(true);

    const result = await transactionService.transferToWallet(
      "sender-id",
      "receiver@example.com",
      "email",
      40,
      {}
    );
    expect(result).toHaveProperty("transferred");
    expect(result.transferred).toBe(40);
    expect(result.to).toBe("receiver@example.com");
  });

  it("successfully transfers funds to another user by user ID", async () => {
    const {
      walletRepository,
    } = require("../src/repositories/wallet.repository");
    // Mock sender wallet
    walletRepository.findByUserId.mockImplementation(async (userId: string) => {
      if (userId === "sender-id")
        return { id: "wallet-id", user_id: "sender-id", balance: 100 };
      if (userId === "receiver-id")
        return {
          id: "receiver-wallet-id",
          user_id: "receiver-id",
          balance: 50,
        };
      return null;
    });
    walletRepository.updateBalance.mockResolvedValue(true);

    const result = await transactionService.transferToWallet(
      "sender-id",
      "receiver-id",
      "id",
      40,
      {}
    );
    expect(result).toHaveProperty("transferred");
    expect(result.transferred).toBe(40);
    expect(result.to).toBe("receiver-id");
  });

  it("rejects transfer with insufficient funds", async () => {
    const {
      walletRepository,
    } = require("../src/repositories/wallet.repository");
    walletRepository.findByUserId.mockResolvedValue({
      id: "wallet-id",
      user_id: "sender-id",
      balance: 10,
    });
    walletRepository.findByEmail.mockResolvedValue({
      id: "receiver-wallet-id",
      user_id: "receiver-id",
      balance: 50,
    });

    await expect(
      transactionService.transferToWallet(
        "sender-id",
        "receiver@example.com",
        "email",
        40,
        {}
      )
    ).rejects.toThrow("Insufficient funds");
  });

  it("rejects transfer to self", async () => {
    const {
      walletRepository,
    } = require("../src/repositories/wallet.repository");
    walletRepository.findByUserId.mockResolvedValue({
      id: "wallet-id",
      user_id: "sender-id",
      balance: 100,
    });
    walletRepository.findByEmail.mockResolvedValue({
      id: "wallet-id",
      user_id: "sender-id",
      balance: 100,
    });

    await expect(
      transactionService.transferToWallet(
        "sender-id",
        "sender-id",
        "id",
        40,
        {}
      )
    ).rejects.toThrow("Cannot transfer to yourself");
    await expect(
      transactionService.transferToWallet(
        "sender-id",
        "sender@example.com",
        "email",
        40,
        {}
      )
    ).rejects.toThrow("Cannot transfer to yourself");
  });

  it("rejects transfer to non-existing user", async () => {
    const {
      walletRepository,
    } = require("../src/repositories/wallet.repository");
    walletRepository.findByUserId.mockResolvedValue({
      id: "wallet-id",
      user_id: "sender-id",
      balance: 100,
    });
    walletRepository.findByEmail.mockResolvedValue(null);

    await expect(
      transactionService.transferToWallet(
        "sender-id",
        "nonexistent@example.com",
        "email",
        40,
        {}
      )
    ).rejects.toThrow("Wallet not found for email");
  });

  it("rejects transfer with negative or zero amount", async () => {
    await expect(
      transactionService.transferToWallet(
        "sender-id",
        "receiver-id",
        "id",
        0,
        {}
      )
    ).rejects.toThrow();
    await expect(
      transactionService.transferToWallet(
        "sender-id",
        "receiver-id",
        "id",
        -10,
        {}
      )
    ).rejects.toThrow();
  });

  it("rejects transfer when sender wallet does not exist", async () => {
    const {
      walletRepository,
    } = require("../src/repositories/wallet.repository");
    walletRepository.findByUserId.mockResolvedValue(null);

    await expect(
      transactionService.transferToWallet(
        "sender-id",
        "receiver-id",
        "id",
        40,
        {}
      )
    ).rejects.toThrow("Wallet not found");
  });
});

describe("Transaction History", () => {
  it("retrieves transaction history for a user", async () => {
    const {
      transactionRepository,
    } = require("../src/repositories/transaction.repository");
    // Mock repository to return transactions and total count
    transactionRepository.getUserTransactions.mockResolvedValue([
      { id: "txn-1", sender_id: "user-id", amount: 50 },
      { id: "txn-2", sender_id: "user-id", amount: 100 },
    ]);
    transactionRepository.getUserTotalTransactions.mockResolvedValue(2);

    const result = await transactionService.getUserTransactions(
      "user-id",
      10,
      0
    );
    expect(result).toHaveProperty("transactions");
    expect(result.transactions).toHaveLength(2);
    expect(result).toHaveProperty("total", 2);
    expect(result.transactions[0]).toHaveProperty("id", "txn-1");
    expect(result.transactions[1]).toHaveProperty("id", "txn-2");
  });
});
