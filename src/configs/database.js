const sequelize = require("sequelize");
const initModels = require("../models/init-models");
const { DB } = require("./index");

const db = new sequelize(DB.NAME, DB.USER, DB.PASS, {
  host: DB.HOST,
  dialect: "mysql",
});
function testConnect() {
  db.authenticate()
    .then(() => {
      console.log("Database connect...");
    })
    .catch((err) => {
      console.log("Connect error: " + err);
    });
}

const models = initModels(db);

module.exports = {
  db: db,
  models: models,
  testConnect,
};
