const jwt = require("jsonwebtoken");
require("dotenv").config();
const models = require("../models");

function verifyToken(req, res, next) {
  const authHeader = req.header("Authorization");
  const token = authHeader.split(" ")[1];

  if (!token) {
    res.sendStatus(401);
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.id = decoded.id;
    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(403);
  }
}

module.exports.verifyToken = verifyToken;
