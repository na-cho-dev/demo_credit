import { IncomingMessage, ServerResponse } from "http";
import { sendResponse } from "../utils/response";
import { userService } from "../services/user.service";

export class UserHandler {
  async getCurrentUser(req: IncomingMessage, res: ServerResponse) {
    try {
      const userReq = req.user;
      const userId = String(userReq?.id);

      if (!userReq) {
        return sendResponse(res, 401, false, {
          status: 401,
          error: "Unauthorized: No user found",
        });
      }

      const { user, wallet } = await userService.getCurrentUser(userId);
      if (!user) {
        return sendResponse(res, 404, false, {
          status: 404,
          error: "User not found",
        });
      }

      // Return consistent success response
      return sendResponse(res, 200, true, {
        status: 200,
        data: { user, wallet },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return sendResponse(res, 400, false, {
          error: error.message,
        });
      }
    }
  }
}

export const userHandler = new UserHandler();
