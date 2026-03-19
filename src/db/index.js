const { Sequelize } = require("sequelize");

function buildSequelizeInstance() {
  const dialect = process.env.DB_DIALECT || "postgres";

  return new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
      dialect,
      logging: false
    }
  );
}

const sequelizeInstance = buildSequelizeInstance();

async function initDb() {
  await sequelizeInstance.authenticate();
}

module.exports = {
  sequelizeInstance,
  initDb
};

