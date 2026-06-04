// Update with your config settings.
require("dotenv").config();
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "pg",
    connection: {
      user: "user",
      database: "stock_control",
      host: "localhost",
    },
    migrations: {
      directory: "./knex_migrations",
    },
    seeds: {
      directory: "./knex_seeds",
    },
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: "./knex_migrations",
    },
    seeds: {
      directory: "./knex_seeds",
    },
  },
};
