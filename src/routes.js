const verifyToken = require("./middlewares/auth");
const generateTokens = require("./utils/genJWT");
const { models } = require("./configs/database");

function route(app) {
  app.post("/login", async (req, res, next) => {
    let email = req.body.email;
    let pass = req.body.password;
    console.log(models);
    const accounts = models.accounts;
    console.log(accounts);
    let user = await accounts.findOne({
      where: {
        email: email,
        pass: pass,
      },
    });

    if (!user) {
      res.sendStatus(401);
    } else {
      const tokens = generateTokens({
        id: user.accountID,
        fullname: user.fullname,
      });
      console.log(tokens);
      res.json(tokens.accessToken);
    }
  });
}

module.exports = route;
