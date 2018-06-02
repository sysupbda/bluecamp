import * as Knex from 'knex';

exports.up = async function(knex: Knex): Promise<void> {
  await knex.schema.createTable('audience', table => {
    table.increments('id').primary('audience_pk');
    table.string('name', 255).unique();
  });

  await knex.schema.createTable('location', table => {
    table.increments('id').primary('location_pk');
    table.string('name', 255).unique();
    table.decimal('lat', 15, 7);
    table.decimal('long', 15, 7);
  });

  await knex.schema.createTable('schedule', table => {
    table.increments('id').primary();
    table.string('name');
    table.dateTime('start');
    table.dateTime('end');
    table.integer('audience_id');
    table.integer('location_id');
    table.foreign('audience_id').references('audience.id');
    table.foreign('location_id').references('location.id');
  });
};

exports.down = async function(knex: Knex): Promise<void> {
  await knex.schema.dropTable('schedule');
  await knex.schema.dropTable('location');
  await knex.schema.dropTable('audience');
};
