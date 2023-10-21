const { models } = require("../configs/database");
const generateTokens = require("../utils/genJWT");
const accounts = models.accounts;

exports.handleLogin = async function (req, res, next) {
  let email = req.body.email;
  let pass = req.body.password;
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
};
