import { IncomingMessage, ServerResponse } from "http";
import { authHandler } from "../handlers/auth.handler";

export const handleAuthRoutes = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  const { url, method } = req;

  if (url === "/api/auth/register" && method === "POST") {
    await authHandler.register(req, res);
    return true;
  }

  if (url === "/api/auth/login" && method === "POST") {
    await authHandler.login(req, res);
    return true;
  }

  return false;
};
