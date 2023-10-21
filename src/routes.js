const accountController = require("./controllers/accountController");

function route(app) {
  app.post("/login", accountController.handleLogin);
}

module.exports = route;
