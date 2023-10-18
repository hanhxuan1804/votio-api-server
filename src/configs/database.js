const sequelize = require("sequelize");

const db = new sequelize("votio", "root", "123456", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = db;
