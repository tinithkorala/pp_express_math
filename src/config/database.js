// Third-party imports
const { Sequelize } = require('sequelize');

const { colorLog } = require('./../utils/log_helper');

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT,
    logging: process.env.DATABASE_LOG === 'false' ? false : true,
  }
);

const connectDb = async () => {
  try {
    await sequelize.authenticate();
    colorLog(
      `🤖 >>> Postgres Db connected : ${process.env.DATABASE_ENV}`,
      'green'
    );
    // await sequelize.sync({ force: true });
    await sequelize.sync();
    colorLog(`🤖 >>> Postgres Db sync : Done`, 'green');
  } catch (error) {
    console.log('🤯 Handle this error : ', error);
  }
};

module.exports = {
  sequelize,
  connectDb,
};
