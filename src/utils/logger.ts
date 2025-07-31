import { NODE_ENV } from "../config/env";
import * as winston from "winston";

const { combine, timestamp, printf, colorize, json, errors } = winston.format;

const isDevelopment = NODE_ENV === "development";

// Custom log format for development
const devFormat = printf(({ level, message, timestamp, ...meta }) => {
  // ANSI color for yellow
  const YELLOW = "\x1b[33m";
  const RESET = "\x1b[0m";
  const metaString =
    meta && Object.keys(meta).length
      ? `\n${YELLOW}${JSON.stringify(meta, null, 2)}${RESET}`
      : "";
  return `[${level}] ${timestamp} - ${message}${metaString}`;
});

// Logger instance
const logger = winston.createLogger({
  level: isDevelopment ? "debug" : "info",
  format: isDevelopment
    ? combine(
        colorize({ all: true }),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errors({ stack: true }),
        devFormat
      )
    : combine(
        colorize({ all: true }),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errors({ stack: true }),
        devFormat
      ),
  transports: [
    new winston.transports.Console(),
    ...(isDevelopment
      ? []
      : [
          new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
          }),
          new winston.transports.File({
            filename: "logs/combined.log",
          }),
        ]),
  ],
  exitOnError: false,
});

export const logInfo = (message: string, meta?: any) => {
  logger.info(message, meta);
};

export const logError = (message: string, error?: Error, meta?: any) => {
  logger.error(message, { error: error?.stack || error, ...meta });
};

export const logWarn = (message: string, meta?: any) => {
  logger.warn(message, meta);
};

export const logDebug = (message: string, meta?: any) => {
  logger.debug(message, meta);
};

export const logHttp = (message: string, meta?: any) => {
  logger.http(message, meta);
};

export default logger;
