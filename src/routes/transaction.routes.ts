import { IncomingMessage, ServerResponse } from "http";
import { authMiddleware } from "../middlewares/auth.middleware";
import { transactionHandler } from "../handlers/transaction.handler";
import { parse } from "url";

export const handleTransactionRoutes = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  const { url, method } = req;
  const { pathname } = parse(url || "", true);

  if (pathname === "/api/transactions/fund" && method === "POST") {
    await authMiddleware(req, res, () =>
      transactionHandler.fundWallet(req, res)
    );
    return true;
  }

  if (pathname === "/api/transactions/withdraw" && method === "POST") {
    await authMiddleware(req, res, () =>
      transactionHandler.withdrawFromWallet(req, res)
    );
    return true;
  }

  if (pathname === "/api/transactions/transfer" && method === "POST") {
    await authMiddleware(req, res, () => transactionHandler.transfer(req, res));
    return true;
  }

  if (pathname === "/api/transactions" && method === "GET") {
    await authMiddleware(req, res, () =>
      transactionHandler.getUserTransactions(req, res)
    );
    return true;
  }

  return false;
};
