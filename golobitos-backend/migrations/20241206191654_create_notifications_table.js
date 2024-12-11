exports.up = function (knex) {
    return knex.schema.createTable('notifications', (table) => {
      table.increments('id').primary(); // Primary key
      table.string('type', 255).notNullable(); // Notification type, e.g., 'new_booking'
      table.text('message').notNullable(); // Notification message
      table.integer('driver_id').unsigned() // Reference to driver
      table.string('user_email').notNullable(); 
      table.string('user_name').notNullable();
      table.integer('booking_id').unsigned() // Reference to booking
      table.boolean('seen').defaultTo(false); // Whether the notification has been seen
      table.timestamp('time_start').notNullable(); // Start time
      table.timestamp('time_end').notNullable(); // End time
      table.string('location_departure').notNullable(); // Departure location
      table.string('location_destination').notNullable(); // Destination location
      table.string('payment_method').notNullable(); 
      table.float('estimated_price').notNullable();
      table.timestamps(true, true);
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('notifications'); // Rollback: Drop the notifications table
  };
  