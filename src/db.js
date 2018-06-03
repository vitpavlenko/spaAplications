/* eslint no-console: 0 */
/* eslint no-process-exit: 0 */

const Sequelize = require('sequelize');
const dbConfig = require('../database/config')[process.env.NODE_ENV || 'development'];

const { username, password, database, host, dialect, sslMode } = dbConfig;

const db = new Sequelize(database, username, password, {
  host,
  dialect,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    ssl: (sslMode === 'require')
  },
  logging: false
});

async function init() {
  
  try {
    await db.authenticate();

    if (process.env.SEQUELIZE_SYNC) {
      return db.sync();
    }

    if (process.env.NODE_ENV !== 'test') {
      console.log('Database connection has been established successfully.');
    }
  } catch (err) {
    console.error('Unable to connect to the database:', err.message);
    process.exit(1);
  }
}

init();

module.exports = db;
