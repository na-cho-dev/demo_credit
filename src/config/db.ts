import knex from "knex";
import logger from "../utils/logger";
import { NODE_ENV } from "./env";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require("../knexfile");

const env = NODE_ENV || "development";
const db = knex(config[env]);

// Test DB connection
(async () => {
  try {
    await db.raw("SELECT 1");
    logger.info("Database connected ✅");
  } catch (error) {
    logger.error(`Database connection failed ❌: ${(error as Error).message}`);
    process.exit(1);
  }
})();

export default db;
