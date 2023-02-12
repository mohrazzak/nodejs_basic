const { Sequelize } = require('sequelize');
const {
  DB_DIALACT,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_USERNAME,
  DB_PORT,
} = require('./constants');

const db = new Sequelize({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  dialect: DB_DIALACT,
  password: DB_PASSWORD,
  username: DB_USERNAME,
  logging: false,
});

(async () => {
  try {
    await db.authenticate();
    console.info('Connected to the DB.');
    await db.sync();
  } catch (error) {
    console.error('Failed to connect with the DB: ', error);
  }
})();

module.exports = db;
