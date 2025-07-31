import { IncomingMessage, ServerResponse } from "http";
import { sendResponse } from "../utils/response";
import { parseBody } from "../utils/bodyParser";
import { transactionService } from "../services/transaction.service";
import { validateBody } from "../utils/validateBody";
import {
  FundWalletDto,
  TransferToWalletDto,
  WithdrawFromWalletDto,
} from "../interfaces/transaction.interface";
import { getQueryParams } from "../utils/requestParams";

export class TransactionHandler {
  async fundWallet(req: IncomingMessage, res: ServerResponse) {
    try {
      const userId = String(req.user?.id);
      const audit = {
        initiatedBy: userId,
        ipAddress: Array.isArray(req.headers["x-forwarded-for"])
          ? req.headers["x-forwarded-for"].join(", ")
          : req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        device: req.headers["user-agent"],
      };
      const body = await parseBody(req);
      const validatedBody = validateBody<FundWalletDto>(body, ["amount"]);
      const { amount } = validatedBody;

      if (typeof amount !== "number" || amount <= 0) {
        return sendResponse(res, 400, false, {
          error: "Amount must be a positive number",
        });
      }

      const result = await transactionService.fundWallet(userId, amount, audit);
      return sendResponse(res, 200, true, {
        message: "Wallet funded successfully",
        data: result,
      });
    } catch (err: any) {
      return sendResponse(res, 400, false, {
        error: err.message,
      });
    }
  }

  async withdrawFromWallet(req: IncomingMessage, res: ServerResponse) {
    try {
      const userId = String(req.user?.id);
      const audit = {
        initiatedBy: userId,
        ipAddress: Array.isArray(req.headers["x-forwarded-for"])
          ? req.headers["x-forwarded-for"].join(", ")
          : req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        device: req.headers["user-agent"],
      };
      const body = await parseBody(req);
      const validatedBody = validateBody<WithdrawFromWalletDto>(body, [
        "amount",
      ]);
      const { amount } = validatedBody;

      if (!amount || amount <= 0) {
        return sendResponse(res, 400, false, {
          error: "Amount must be greater than 0",
        });
      }

      const result = await transactionService.withdrawFromWallet(
        userId,
        amount,
        audit
      );
      return sendResponse(res, 200, true, {
        message: "Withdrawal successful",
        data: result,
      });
    } catch (err: any) {
      return sendResponse(res, 400, false, {
        error: err.message,
      });
    }
  }

  async transfer(req: IncomingMessage, res: ServerResponse) {
    try {
      const userId = String(req.user?.id);
      const audit = {
        initiatedBy: userId,
        ipAddress: Array.isArray(req.headers["x-forwarded-for"])
          ? req.headers["x-forwarded-for"].join(", ")
          : req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        device: req.headers["user-agent"],
      };
      const body = await parseBody(req);
      const validatedBody = validateBody<TransferToWalletDto>(body, [
        "receiverUserId",
        "receiverEmail",
        "amount",
      ]);
      const { receiverUserId, receiverEmail, amount } = validatedBody;

      if (
        (!receiverUserId && !receiverEmail) ||
        (receiverUserId && receiverEmail)
      ) {
        return sendResponse(res, 400, false, {
          error: "Provide exactly one of receiverUserId or receiverEmail",
        });
      }

      if (typeof amount !== "number" || amount <= 0) {
        return sendResponse(res, 400, false, {
          error: "Amount must be a positive number",
        });
      }

      const receiverIdentifier = receiverUserId || receiverEmail;
      const receiverType = receiverUserId ? "id" : "email";

      const result = await transactionService.transferToWallet(
        userId,
        receiverIdentifier,
        receiverType,
        amount,
        audit
      );
      return sendResponse(res, 200, true, {
        message: "Transfer successful",
        data: result,
      });
    } catch (err: any) {
      return sendResponse(res, 400, false, {
        error: err.message,
      });
    }
  }

  async getUserTransactions(req: IncomingMessage, res: ServerResponse) {
    try {
      const userId = String(req.user?.id);
      const limit = Number(getQueryParams(req.url ?? "", "limit")) || 10;
      const page = Number(getQueryParams(req.url ?? "", "page")) || 1;
      const offset = (page - 1) * limit;

      // Get transactions and total count (update your service to support this)
      const { transactions, total } =
        await transactionService.getUserTransactions(userId, limit, offset);

      return sendResponse(res, 200, true, {
        data: transactions,
        meta: {
          limit,
          page,
          offset,
          total,
          count: transactions.length,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err: any) {
      return sendResponse(res, 400, false, {
        error: err.message,
      });
    }
  }
}
export const transactionHandler = new TransactionHandler();
