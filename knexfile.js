// Update with your config settings.
require("dotenv").config();
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: "./knex_migrations",
    },
    seeds: {
      directory: "./knex_seeds",
    },
};
