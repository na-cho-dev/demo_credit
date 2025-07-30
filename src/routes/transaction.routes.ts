import { IncomingMessage, ServerResponse } from "http";
import { authMiddleware } from "../middlewares/auth.middleware";
import { transactionHandler } from "../handlers/transaction.handler";

export const handleTransactionRoutes = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  const { url, method } = req;

  if (url === "/api/transactions/fund" && method === "POST") {
    await authMiddleware(req, res, () =>
      transactionHandler.fundWallet(req, res)
    );
    return true;
  }

  if (url === "/api/transactions/withdraw" && method === "POST") {
    await authMiddleware(req, res, () =>
      transactionHandler.withdrawFromWallet(req, res)
    );
    return true;
  }

  if (url === "/api/transactions/transfer" && method === "POST") {
    await authMiddleware(req, res, () => transactionHandler.transfer(req, res));
    return true;
  }

  return false;
};
