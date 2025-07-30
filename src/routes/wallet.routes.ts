import { IncomingMessage, ServerResponse } from "http";
import { authMiddleware } from "../middlewares/auth.middleware";
import { walletHandler } from "../handlers/wallet.handler";

export const handleWalletRoutes = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  const { url, method } = req;

  if (url === "/api/wallets/me" && method === "GET") {
    await authMiddleware(req, res, () =>
      walletHandler.getCurrentUserWallet(req, res)
    );
    return true;
  }

  const walletBalanceMatch = url?.match(/^\/api\/wallets\/([^/]+)\/balance$/);
  if (walletBalanceMatch && method === "GET") {
    await authMiddleware(req, res, () =>
      walletHandler.getUserWalletById(req, res)
    );
    return true;
  }

  return false;
};
