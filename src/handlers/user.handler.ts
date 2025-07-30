import { IncomingMessage, ServerResponse } from "http";
import { sendResponse } from "../utils/response";

export class UserHandler {
  async getCurrentUser(req: IncomingMessage, res: ServerResponse) {
    try {
      const user = req.user;

      if (!user) {
        return sendResponse(res, 401, false, {
          status: 401,
          error: "Unauthorized: No user found",
        });
      }

      // Return consistent success response
      return sendResponse(res, 200, true, {
        status: 200,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error: any) {
      return sendResponse(res, 400, false, {
        error: error.message,
      });
    }
  }
}

export const userHandler = new UserHandler();
