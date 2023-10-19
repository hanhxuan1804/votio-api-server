const sequelize = require("sequelize");
const initModels = require("../models/init-models");

const db = new sequelize("votio", "root", "123456", {
  host: "localhost",
  dialect: "mysql",
});
// db.authenticate()
//   .then(() => {
//     console.log("Database connect...");
//   })
//   .catch((err) => {
//     console.log("Connect error: " + err);
//   });

const models = initModels(db);

module.exports = {
  dbConnect: db,
  models: models,
};
