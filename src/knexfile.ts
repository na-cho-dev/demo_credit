import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "./config/env";

const config = {
  development: {
    client: "mysql2",
    connection: {
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT,
    },
    migrations: {
      directory: "./database/migrations",
      tableName: "knex_migrations",
      extension: "ts",
    },
  },
};

// export default config;
module.exports = config;
