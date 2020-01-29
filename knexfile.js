module.exports = {
    client: 'postgresql',
    connection: {
      database: 'new_database',
      user:     'postgres',
      password: 'root'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
};
