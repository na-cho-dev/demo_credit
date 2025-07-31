import { configDotenv } from "dotenv";
import { resolve } from "path";

configDotenv({
  path: resolve(__dirname, "../../.env"),
});

export const getEnv = (key: string, defaultValue?: string): string => {
  const envValue = process.env[key] || defaultValue;

  if (envValue === undefined) {
    throw new Error(`Missing Environment Variable: ${key}`);
  }

  return envValue;
};

export const PORT = parseInt(getEnv("PORT", "3330"), 10);
export const NODE_ENV = getEnv("NODE_ENV", "development");
export const HOST = getEnv("HOST", "0.0.0.0");
export const DB_HOST = getEnv("DB_HOST");
export const DB_USER = getEnv("DB_USER");
export const DB_PASSWORD = getEnv("DB_PASSWORD");
export const DB_NAME = getEnv("DB_NAME");
export const DB_PORT = parseInt(getEnv("DB_PORT", "3306"), 10);
export const ADJUTOR_API_KEY = getEnv("ADJUTOR_API_KEY");
export const KARMA_CHECK = getEnv("KARMA_CHECK", "false");

