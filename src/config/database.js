require('dotenv').config();

module.exports = {
  database: process.env.DB_NAME || 'mintai_db',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'commonone',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      }
    }
};