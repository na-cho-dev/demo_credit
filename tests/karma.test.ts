import { authService } from "../src/services/auth.service";
const { isUserBlacklisted } = require("../src/services/karma.service");

jest.mock("../src/services/karma.service", () => ({
  isUserBlacklisted: jest.fn(),
}));

it("rejects registration for blacklisted user", async () => {
  isUserBlacklisted.mockResolvedValue(true);
  await expect(
    authService.register("Bad User", "bad@example.com")
  ).rejects.toThrow("User is blacklisted and cannot be onboarded");
});
