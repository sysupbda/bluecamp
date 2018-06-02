// Update with your config settings.
import { config } from './server/config';

const dbOptions = {
  client: 'postgresql',
  connection: config.databaseUrl,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};

module.exports = {
  development: dbOptions,
  production: dbOptions,
  staging: dbOptions
};
