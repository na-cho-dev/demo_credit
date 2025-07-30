import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("(UUID())"));
    table.string("full_name").notNullable();
    table.string("email").notNullable().unique();
    table.timestamps(true, true);
  });

  await knex.schema.createTable("wallets", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("(UUID())"));
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.decimal("balance", 14, 2).notNullable().defaultTo(0.0);
    table.timestamps(true, true);
  });

  await knex.schema.createTable("transactions", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("(UUID())"));
    table
      .uuid("sender_id")
      .nullable()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");
    table
      .uuid("receiver_id")
      .nullable()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");
    table.enum("type", ["FUND", "TRANSFER", "WITHDRAW"]).notNullable();
    table.decimal("amount", 14, 2).notNullable();
    table.string("status").notNullable().defaultTo("SUCCESS");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("transactions");
  await knex.schema.dropTableIfExists("wallets");
  await knex.schema.dropTableIfExists("users");
}
