/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("stock").del();
  await knex("stock").insert([{ photo_name: "dummy1", user_id: "abc" }]);
};
