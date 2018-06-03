const parseDbUrl = require('parse-database-url');
const dotenv = require('dotenv');

dotenv.config();

const { NODE_ENV, HEROKU_POSTGRESQL_CHARCOAL_URL, TEST_DATABASE_URL } = process.env;

const dbConfig = (HEROKU_POSTGRESQL_CHARCOAL_URL) ? parseDbUrl(HEROKU_POSTGRESQL_CHARCOAL_URL) : {};//parseDbUrl('');//{};

if (!HEROKU_POSTGRESQL_CHARCOAL_URL) {
  throw new Error('DATABASE_URL is not specified');
}

if (!dbConfig.database) {
  throw new Error('Unknown DATABASE_URL format');
}

const testDbConfig = (TEST_DATABASE_URL) ? parseDbUrl(TEST_DATABASE_URL) : {};

if (NODE_ENV === 'test') {
  if (!TEST_DATABASE_URL) {
    throw new Error('TEST_DATABASE_URL is not specified');
  }

  if (!testDbConfig.database) {
    throw new Error('Unknown TEST_DATABASE_URL format');
  }
}

module.exports = {
  development: {
    username: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    host: dbConfig.host,
    dialect: dbConfig.driver,
    migrationStorageTableName: 'sequelize_meta',
    seederStorage: 'sequelize',
    seederStorageTableName: 'sequelize_data',
    sslMode: dbConfig.sslmode
  },
  test: {
    username: testDbConfig.user,
    password: testDbConfig.password,
    database: testDbConfig.database,
    host: testDbConfig.host,
    dialect: testDbConfig.driver,
    migrationStorageTableName: 'sequelize_meta',
    seederStorage: 'sequelize',
    seederStorageTableName: 'sequelize_data',
    sslMode: testDbConfig.sslmode
  },
  production: {
    username: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    host: dbConfig.host,
    dialect: dbConfig.driver,
    migrationStorageTableName: 'sequelize_meta',
    seederStorage: 'sequelize',
    seederStorageTableName: 'sequelize_data',
    sslMode: dbConfig.sslmode
  }
};
