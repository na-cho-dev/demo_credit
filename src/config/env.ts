import { configDotenv } from "dotenv";
import { resolve } from "path";

configDotenv({
  path: resolve(__dirname, "../../.env"),
});

export const getEnv = (key: string, defaultValue?: string): string => {
  const envValue = process.env[key] || defaultValue;

  if (envValue === undefined)
    throw new Error(`Missing Environment Variable: ${key}`);

  return envValue;
};

export const envConfig = {
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: parseInt(getEnv("PORT", "3330"), 10),
  HOST: getEnv("HOST", "0.0.0.0"),

  DB_HOST: getEnv("DB_HOST"),
  DB_PORT: parseInt(getEnv("DB_PORT", "3306"), 10),
  DB_USER: getEnv("DB_USER"),
  DB_PASSWORD: getEnv("DB_PASSWORD"),
  DB_NAME: getEnv("DB_NAME"),
  ADJUTOR_API_KEY: getEnv("ADJUTOR_API_KEY"),
  KARMA_CHECK: getEnv("KARMA_CHECK", "false"),
};
