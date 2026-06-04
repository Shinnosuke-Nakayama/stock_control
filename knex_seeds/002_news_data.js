/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("news").del();
  await knex("news").insert([
    { post_date: "2008-01-01", post_user: "toranpu", contents: "テスト１" },
  ]);
};
