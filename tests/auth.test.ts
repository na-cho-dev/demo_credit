import { authService } from "../src/services/auth.service";

// Mock the userRepository and walletService to avoid real DB calls
jest.mock("../src/repositories/user.repository", () => ({
  userRepository: {
    findByEmail: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockImplementation(async (data) => ({
      id: "mock-user-id",
      full_name: data.full_name,
      email: data.email,
    })),
    findById: jest.fn().mockResolvedValue({
      id: "mock-user-id",
      full_name: "Test User",
      email: "test@example.com",
    }),
  },
}));

jest.mock("../src/services/wallet.service", () => ({
  walletService: {
    createWalletForUser: jest.fn().mockResolvedValue({
      id: "mock-wallet-id",
      user_id: "mock-user-id",
      balance: 0,
    }),
    getWalletByEmail: jest.fn().mockResolvedValue({
      id: "mock-wallet-id",
      user_id: "mock-user-id",
      balance: 100,
    }),
  },
}));

describe("User Registration", () => {
  it("registers a new user with valid data", async () => {
    jest
      .spyOn(require("../src/services/karma.service"), "isUserBlacklisted")
      .mockResolvedValue(false);

    const data = await authService.register("Test User", "test@example.com");
    expect(data.user).toHaveProperty("id");
    expect(data.user.email).toBe("test@example.com");
    expect(data.token).toBe("fake-token-mock-user-id");
  });

  it("rejects registration for blacklisted user", async () => {
    jest
      .spyOn(require("../src/services/karma.service"), "isUserBlacklisted")
      .mockResolvedValue(true);

    await expect(
      authService.register("Bad User", "bad@example.com")
    ).rejects.toThrow("User is blacklisted and cannot be onboarded");
  });

  it("rejects registration for duplicate email", async () => {
    const { userRepository } = require("../src/repositories/user.repository");
    userRepository.findByEmail.mockResolvedValue({
      id: "existing-user-id",
      full_name: "Existing User",
      email: "test@example.com",
    });

    jest
      .spyOn(require("../src/services/karma.service"), "isUserBlacklisted")
      .mockResolvedValue(false);

    await expect(
      authService.register("Test User", "test@example.com")
    ).rejects.toThrow("Email already in use");
  });
});

describe("User Login", () => {
  it("logs in an existing user with valid email", async () => {
    const { userRepository } = require("../src/repositories/user.repository");
    userRepository.findByEmail.mockResolvedValue({
      id: "mock-user-id",
      full_name: "Test User",
      email: "test@example.com",
    });
    const data = await authService.login("test@example.com");
    expect(data.user).toHaveProperty("id");
    expect(data.user.email).toBe("test@example.com");
    expect(data.token).toBe("fake-token-mock-user-id");
  });

  it("rejects login for non-existing user", async () => {
    const { userRepository } = require("../src/repositories/user.repository");
    userRepository.findByEmail.mockResolvedValue(null);
    await expect(authService.login("nonexistent@example.com")).rejects.toThrow(
      "User does not exist"
    );
  });
});
