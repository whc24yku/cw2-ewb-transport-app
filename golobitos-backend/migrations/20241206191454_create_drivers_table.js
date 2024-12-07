exports.up = function (knex) {
    return knex.schema.createTable('drivers', (table) => {
      table.increments('id').primary(); // Primary key
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE') // Ensures related records are deleted if a user is deleted
        .notNullable()
        .unique(); // Each driver must correspond to a unique user
  
      table.string('type', 255).notNullable(); // Vehicle type (e.g., car, van, bike)
      table.string('model', 255).notNullable(); // Vehicle model
      table.integer('seats').unsigned().notNullable(); // Number of seats in the vehicle
      table.string('make', 255).notNullable(); // Vehicle make (e.g., Toyota, Honda)
      table.string('chasis_number', 255).unique().notNullable(); // Unique chassis number
      table.string('plate_number', 255).unique().notNullable(); // Unique plate number
      table.boolean('validated').defaultTo(false); // Validation status
      table.string('insurance_number', 255).unique().notNullable(); // Insurance policy number
  
      table.timestamps(true, true);
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('drivers'); // Rollback: Drop the drivers table
  };
  