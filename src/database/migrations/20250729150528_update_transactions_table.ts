import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Change status from string to enum
  await knex.schema.alterTable("transactions", (table) => {
    table.dropColumn("status");
  });

  await knex.schema.alterTable("transactions", (table) => {
    table
      .enu("status", ["SUCCESS", "FAILED"])
      .notNullable()
      .defaultTo("SUCCESS");
  });

  await knex.schema.alterTable("transactions", (table) => {
    table.string("reference").notNullable().unique();
    table.json("metadata").nullable();
    table
      .uuid("wallet_id")
      .nullable()
      .references("id")
      .inTable("wallets")
      .onDelete("SET NULL");

    table.decimal("balance_before", 14, 2).nullable();
    table.decimal("balance_after", 14, 2).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("transactions", (table) => {
    table.dropColumn("reference");
    table.dropColumn("metadata");
    table.dropColumn("wallet_id");
    table.dropColumn("balance_before");
    table.dropColumn("balance_after");
    table.dropColumn("status");
  });

  await knex.schema.alterTable("transactions", (table) => {
    table.string("status").notNullable().defaultTo("SUCCESS");
  });
}
