import { IncomingMessage, ServerResponse } from "http";
import { authMiddleware } from "../middlewares/auth.middleware";
import { userHandler } from "../handlers/user.handler";

export const handleUserRoutes = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  const { url, method } = req;

  if (url === "/api/users/me" && method === "GET") {
    await authMiddleware(req, res, async () => {
      await userHandler.getCurrentUser(req, res);
    });

    return true;
  }

  return false;
};
