/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('username').notNullable();
      table.string('email').unique().notNullable();
      table.string('password');
      table.string('role').notNullable();
      table.string('name');
      table.string('phoneNumber');
      table.integer('age');
      table.enum('sex', ['male', 'female', 'other']);
      table.string('address');
      table.date('dateOfBirth');
      table.specificType('address_favourite', 'text[]').nullable();
      table.timestamp('account_end').nullable();
      table.timestamps(true, true);
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function (knex) {
    return knex.schema.dropTable('users');
  };
  