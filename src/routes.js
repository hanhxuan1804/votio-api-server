const verifyToken = require("./middlewares/auth");
const generateTokens = require("./utils/genJWT");
const accounts = require("./models").accounts;

function route(app) {
  app.post("/login", async (req, res, next) => {
    let email = req.body.email;
    let pass = req.body.password;

    let user = await accounts.findOne({
      where: {
        email: email,
        password: pass,
      },
    });

    if (!user) {
      res.sendStatus(401);
    } else {
      const tokens = generateTokens({ id: user.id, fullname: user.fullname });
      console.log(tokens);
      res.json(tokens.accessToken);
    }
  });
}

module.exports = route;
