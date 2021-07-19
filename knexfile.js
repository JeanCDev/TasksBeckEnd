module.exports = {
  client: 'pg',
  connection: {
    database: 'tasks',
    user:     'postgres',
    password: '19029696',
    port: 5433
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};
