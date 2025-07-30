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

export class TransactionHandler {
  async fundWallet(req: IncomingMessage, res: ServerResponse) {
    try {
      const user = req.user!;
      const body = await parseBody(req);
      const validatedBody = validateBody<FundWalletDto>(body, ["amount"]);
      const { amount } = validatedBody;

      if (typeof amount !== "number" || amount <= 0) {
        return sendResponse(res, 400, false, {
          error: "Amount must be a positive number",
        });
      }

      const result = await transactionService.fundWallet(
        String(user.id),
        amount
      );
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
        amount
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
      const user = req.user!;
      const body = await parseBody(req);
      const validatedBody = validateBody<TransferToWalletDto>(body, [
        "receiverUserId",
        "amount",
      ]);
      const { receiverUserId, amount } = validatedBody;

      if (typeof receiverUserId !== "string" || receiverUserId.trim() === "") {
        return sendResponse(res, 400, false, {
          error: "receiverUserId must be a valid string",
        });
      }

      if (typeof amount !== "number" || amount <= 0) {
        return sendResponse(res, 400, false, {
          error: "Amount must be a positive number",
        });
      }

      const result = await transactionService.transferToWallet(
        String(user.id),
        receiverUserId,
        amount
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
}

export const transactionHandler = new TransactionHandler();
