import { walletService } from "../src/services/wallet.service";

jest.mock("../src/repositories/wallet.repository", () => ({
  walletRepository: {
    create: jest.fn().mockResolvedValue({
      id: "mock-wallet-id",
      user_id: "mock-user-id",
      balance: 0,
    }),
    findByUserId: jest.fn().mockImplementation(async (userId: string) => {
      if (userId === "mock-user-id") {
        return { id: "mock-wallet-id", user_id: userId, balance: 100 };
      }
      return null;
    }),
    findById: jest.fn().mockImplementation(async (walletId: string) => {
      if (walletId === "mock-wallet-id") {
        return { id: walletId, user_id: "mock-user-id", balance: 100 };
      }
      return null;
    }),
    findByEmail: jest.fn().mockImplementation(async (email: string) => {
      if (email === "test@example.com") {
        return { id: "mock-wallet-id", user_id: "mock-user-id", balance: 100 };
      }
      return null;
    }),
  },
}));

describe("Wallet Service", () => {
  it("automatically creates a wallet for a new user", async () => {
    const wallet = await walletService.createWalletForUser("mock-user-id");
    expect(wallet).toHaveProperty("id");
    expect(wallet.user_id).toBe("mock-user-id");
    expect(wallet.balance).toBe(0);
  });

  //   it("rejects wallet creation for non-existing user (if exposed)", async () => {
  //     // Simulate repository returning null for non-existing user
  //     const {
  //       walletRepository,
  //     } = require("../src/repositories/wallet.repository");
  //     walletRepository.create.mockResolvedValue(null);

  //     await expect(
  //       walletService.createWalletForUser("non-existent-id")
  //     ).rejects.toThrow();
  //   });

  it("retrieves wallet for authenticated user", async () => {
    const wallet = await walletService.getWalletByUserId("mock-user-id");
    expect(wallet).not.toBeNull();
    expect(typeof wallet).toBe("object");
    expect(wallet).toHaveProperty("id");
    expect(wallet).toHaveProperty("user_id");
    expect(wallet.user_id).toBe("mock-user-id");
    expect(wallet.balance).toBe(100);
  });

  it("retrieves wallet by user ID", async () => {
    const wallet = await walletService.getWalletByUserId("mock-user-id");
    expect(wallet).toHaveProperty("id");
    expect(wallet.user_id).toBe("mock-user-id");
  });

  it("retrieves wallet by user email", async () => {
    const wallet = await walletService.getWalletByEmail("test@example.com");
    expect(wallet).toHaveProperty("id");
    expect(wallet.user_id).toBe("mock-user-id");
  });

  it("rejects retrieval for non-existing wallet/user by user ID", async () => {
    await expect(
      walletService.getWalletByUserId("non-existent-id")
    ).rejects.toThrow("Wallet not found");
  });

  it("rejects retrieval for non-existing wallet/user by wallet ID", async () => {
    await expect(
      walletService.getWalletById("non-existent-wallet-id")
    ).rejects.toThrow("Wallet not found");
  });

  it("rejects retrieval for non-existing wallet/user by email", async () => {
    await expect(
      walletService.getWalletByEmail("nonexistent@example.com")
    ).rejects.toThrow("Wallet not found for email");
  });
});
