const accountController = require("./controllers/accountController");

function route(app) {
  app.post("/login", accountController.handleLogin);
  app.post("/register", accountController.handleRegister);
}
module.exports = route;
