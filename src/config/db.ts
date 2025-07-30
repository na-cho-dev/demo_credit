import knex from "knex";
import config from "../knexfile";
import logger from "../utils/logger";

const env = process.env.NODE_ENV || "development";
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
