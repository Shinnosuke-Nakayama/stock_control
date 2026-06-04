const environment = "development";
const config = require("./knexfile.js")[process.env.NODE_ENV || environment];
const knex = require("knex")(config);

module.exports = knex;
