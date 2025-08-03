import knex, { Knex } from "knex";
import logger from "../utils/logger";
import { envConfig } from "./env";

// Import knexfile with proper typing
const knexConfig = require("../knexfile") as Record<string, Knex.Config>;

const env = envConfig.NODE_ENV || "development";
const db = knex(knexConfig[env]);

// Database connection function
export const connectToDatabase = async (): Promise<void> => {
  try {
    await db.raw("SELECT 1");
    logger.info("🟢 Database connected successfully!");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown database error";
    logger.error(`❌ Database connection failed : ${errorMessage}`);
    throw new Error(`Database connection failed: ${errorMessage}`);
  }
};

export default db;
