const { models } = require("../configs/database");
const generateTokens = require("../utils/genJWT");
const accounts = models.accounts;
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { CreatedResponse, OkResponse } = require("../core/success.response");
const {
  NotFoundResponseError,
  InternalServerError,
} = require("../core/error.response");

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
    throw new NotFoundResponseError("Not found User");
  }

  const tokens = generateTokens({
    id: user.accountID,
    fullname: user.fullname,
  });

  //console.log(tokens);
  new OkResponse("Login successfully", tokens).send(res);
};

exports.handleRegister = async (req, res, next) => {
  const data = {
    fullname: req.body.fullname,
    pass: req.body.password,
    email: req.body.email,
    isAdmin: 0,
  };

  let newUser = await accounts.create(data);
  if (!newUser) {
    throw new Error(InternalServerError);
  }
  tokens = generateTokens({
    id: newUser.accountID,
    fullname: newUser.fullname,
  });
  newUser.refreshToken = tokens.refreshToken.toString();
  await newUser.save();
  new OkResponse("Register successfully", { newUser, tokens }).send(res);
};

exports.refreshAccessToken = async (req, res, next) => {
  const decoded = jwt.verify(
    req.body.refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  const user = await accounts.findOne({
    where: {
      accountID: decoded.id,
    },
  });
  if (!user) throw new Error(NotFoundResponseError);
  if (user.refreshToken !== req.body.refreshToken)
    throw new Error(NotFoundResponseError);
  const payload = {
    id: user.accountID,
    fullname: user.fullname,
  };
  const tokens = generateTokens(payload);
  user.refreshToken = tokens.refreshToken;
  user.save();
  new OkResponse("Refresh tokens successfully", tokens).send(res);
};
