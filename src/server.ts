import "./config/db";
import * as http from "http";
import { parse } from "url";
import { router } from "./routes/index";
import logger from "./utils/logger";
import { HOST, NODE_ENV, PORT } from "./config/env";

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

server.listen(PORT, HOST, () => {
  logger.info("🚀 Server started successfully!", {
    environment: NODE_ENV,
    host: HOST,
    port: PORT,
    startedAt: new Date().toLocaleString(),
  });
});


