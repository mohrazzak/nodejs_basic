require('dotenv').config();

const {
  DB_USERNAME,
  DB_PASSWORD,
  DB_DIALACT,
  DB_NAME,
  DB_HOST,
  DB_PORT,
  EMAIL_TOKEN,
  EM_HOST,
  EM_USER,
  EM_PASSWORD,
  NODE_ENV,
  LOCAL_URL,
  PRO_URL,
  NODE_PORT,
  AUTH_TOKEN,
} = process.env;

module.exports = Object.freeze({
  DB_USERNAME,
  DB_PASSWORD,
  DB_PORT,
  DB_DIALACT,
  DB_HOST,
  DB_NAME,
  EMAIL_TOKEN,
  EM_HOST,
  EM_USER,
  EM_PASSWORD,
  NODE_ENV,
  LOCAL_URL,
  PRO_URL,
  NODE_PORT,
  AUTH_TOKEN,
});
