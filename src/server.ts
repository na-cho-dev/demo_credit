import * as http from "http";
import { parse } from "url";
import { router } from "./routes/index";
import logger from "./utils/logger";
import { connectToDatabase } from "./config/db";
import { envConfig } from "./config/env";

const server = http.createServer(async (req, res) => {
  const { pathname } = parse(req.url || "", true);
  res.setHeader("X-Powered-By", "DemoCredit");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Cache-Control", "no-store");

  try {
    await router(req, res);
  } catch (err: any) {
    logger.error(`[SERVER ERROR]: ${err.message}`);
    res.writeHead(500);
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
});

// Start server with database connection
const startServer = async (): Promise<void> => {
  try {
    // Connect to database first
    await connectToDatabase();

    // Start the server
    server.listen(envConfig.PORT, envConfig.HOST, () => {
      logger.info("🚀 Server started successfully!", {
        environment: envConfig.NODE_ENV,
        host: envConfig.HOST,
        port: envConfig.PORT,
        startedAt: new Date().toLocaleString(),
      });
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown startup error";
    logger.error(`Failed to start server: ${errorMessage}`);
    process.exit(1);
  }
};

// Start the server
void startServer();
