import { IncomingMessage, ServerResponse } from "http";
import { sendResponse } from "../utils/response";
import { walletService } from "../services/wallet.service";
import { getRouteParams } from "../utils/requestParams";
import { parse } from "url";

export class WalletHandler {
  async getCurrentUserWallet(req: IncomingMessage, res: ServerResponse) {
    const user = req.user;
    if (!user || !user.id)
      return sendResponse(res, 401, false, {
        error: "User not authenticated",
      });

    const wallet = await walletService.getWalletByUserId(String(user.id));
    return sendResponse(res, 200, true, {
      message: "Wallet retrieved successfully",
      data: wallet,
    });
  }

  // async getUserWalletById(req: IncomingMessage, res: ServerResponse) {
  //   const user = req.user;
  //   if (!user || !user.id)
  //     return sendResponse(res, 401, false, {
  //       error: "User not authenticated",
  //     });

  //   const { pathname } = parse(req.url || "", true);
  //   const routeParams = getRouteParams(
  //     "/api/wallets/:walletId/balance",
  //     pathname || ""
  //   );
  //   const { walletId } = routeParams;
  //   if (!walletId)
  //     return sendResponse(res, 400, false, {
  //       error: "Wallet ID is required",
  //     });

  //   const wallet = await walletService.getWalletById(walletId);
  //   if (!wallet)
  //     return sendResponse(res, 404, false, {
  //       error: "Wallet not found",
  //     });

  //   return sendResponse(res, 200, true, {
  //     message: "Wallet retrieved successfully",
  //     data: wallet,
  //   });
  // }
}

export const walletHandler = new WalletHandler();
