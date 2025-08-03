import { envConfig } from "./config/env";

const config = {
  development: {
    client: "mysql2",
    connection: {
      host: envConfig.DB_HOST,
      user: envConfig.DB_USER,
      password: envConfig.DB_PASSWORD,
      database: envConfig.DB_NAME,
      port: envConfig.DB_PORT,
    },
    migrations: {
      directory: "./database/migrations",
      tableName: "knex_migrations",
      extension: "ts",
    },
  },
  staging: {
    client: "mysql2",
    connection: {
      host: envConfig.DB_HOST,
      user: envConfig.DB_USER,
      password: envConfig.DB_PASSWORD,
      database: envConfig.DB_NAME,
      port: envConfig.DB_PORT,
    },
    migrations: {
      directory: "./database/migrations",
      tableName: "knex_migrations",
      extension: "js",
    },
  },
  test: {
    client: "mysql2",
    connection: {
      host: envConfig.DB_HOST,
      user: envConfig.DB_USER,
      password: envConfig.DB_PASSWORD,
      database: envConfig.DB_NAME,
      port: envConfig.DB_PORT,
    },
    migrations: {
      directory: "./database/migrations",
      tableName: "knex_migrations",
      extension: "ts",
    },
  },
  production: {
    client: "mysql2",
    connection: {
      host: envConfig.DB_HOST,
      user: envConfig.DB_USER,
      password: envConfig.DB_PASSWORD,
      database: envConfig.DB_NAME,
      port: envConfig.DB_PORT,
    },
    migrations: {
      directory: "./database/migrations",
      tableName: "knex_migrations",
      extension: "js",
    },
  },
};

// export default config;
module.exports = config;
