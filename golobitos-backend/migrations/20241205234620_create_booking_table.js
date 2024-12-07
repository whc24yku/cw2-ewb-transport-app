exports.up = function(knex) {
    return knex.schema.createTable('booking', (table) => {
      table.increments('id').primary(); // Primary key
      table.date('date').notNullable(); // Booking date
      table.string('timeslot').notNullable(); // Timeslot
      table.timestamp('time_start').notNullable(); // Start time
      table.timestamp('time_end').notNullable(); // End time
      table.string('location_departure').notNullable(); // Departure location
      table.string('location_destination').notNullable(); // Destination location
      table.integer('driver_id').unsigned().notNullable(); // Driver ID
      table.integer('customer_pack_id').unsigned().notNullable(); // Customer package ID
      table.integer('number_of_customers').notNullable(); // Number of customers
      table.integer('inventory_pack_id').unsigned().notNullable(); // Inventory package ID
      table.integer('number_of_package').notNullable(); // Number of packages
      table.boolean('shared').notNullable().defaultTo(false); // Shared transport flag
      table.float('weight').notNullable(); // Weight of the cargo
      table.float('estimated_price').notNullable(); // Estimated price
      table.string('vehicle_type').notNullable(); // Vehicle type
      table.string('transport_type').notNullable(); // Transport type (e.g., standard, medical)
      table.boolean('priority').notNullable().defaultTo(false); // Priority flag
      table.string('status').notNullable();
      
      // Optionally, you can add foreign key constraints if driver_id, customer_pack_id, or inventory_pack_id reference other tables:
      // table.foreign('driver_id').references('drivers.id');
      // table.foreign('customer_pack_id').references('customer_packs.id');
      // table.foreign('inventory_pack_id').references('inventory_packs.id');
      
      table.timestamps(true, true); // Created at and updated at timestamps
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('booking');
  };
  