import { IncomingMessage, ServerResponse } from "http";
import { handleAuthRoutes } from "./auth.routes";
import { handleUserRoutes } from "./user.routes";
import { handleWalletRoutes } from "./wallet.routes";
import { handleTransactionRoutes } from "./transaction.routes";
import { sendResponse } from "../utils/response";
import logger from "../utils/logger";

export const router = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    logger.info(`[REQUEST] ${req.method} ${req.url}`, {
      // ip: req.socket.remoteAddress,
      // headers: req.headers,
    });

    const handlers = [
      handleAuthRoutes,
      handleUserRoutes,
      handleWalletRoutes,
      handleTransactionRoutes,
    ];

    for (const handler of handlers) {
      const handled = await handler(req, res);
      if (handled) return;
    }

    // Log and respond for root route
    if (req.url === "/" && req.method === "GET") {
      // logger.info("Root route accessed");
      sendResponse(res, 200, true, {
        message: "Welcome to DemoCredit API",
        environment: process.env.NODE_ENV,
        version: "1.0.0",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // No handler matched the route
    sendResponse(res, 404, false, {
      error: "Route not found",
    });
  } catch (err: any) {
    sendResponse(res, err.statusCode || 500, false, {
      error: err.message,
    });
  }
};
