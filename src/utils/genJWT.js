const jwt = require("jsonwebtoken");
require("dotenv").config();

function generateTokens(payload) {
  const { id, fullname } = payload;
  const accessToken = jwt.sign(
    { id, fullname },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "2h",
    }
  );
  return { accessToken };
}

module.exports = generateTokens;
