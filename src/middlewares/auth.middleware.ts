import { IncomingMessage, ServerResponse } from "http";
import { sendResponse } from "../utils/response";
import { userRepository } from "../repositories/user.repository";
import logger from "../utils/logger";

export const authMiddleware = async (
  req: IncomingMessage,
  res: ServerResponse,
  next: () => Promise<void>
) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendResponse(res, 401, false, {
      error: "Unauthorized: Missing token",
    });
  }

  const token = authHeader.split(" ")[1]; // e.g., "fake-token-3"

  if (!token.startsWith("fake-token-"))
    return sendResponse(res, 401, false, { error: "Invalid token format" });

  const userId = token.replace("fake-token-", "");

  try {
    const user = await userRepository.findById(userId);
    if (!user) return sendResponse(res, 401, false, { error: "Invalid token" });

    req.user = user;
    await next();
  } catch (err: any) {
    logger.error(`[AUTH MIDDLEWARE ERROR]: ${err.message}`);
    return sendResponse(res, 500, false, { error: "Authentication Error" });
  }
};
