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
  const refreshToken = jwt.sign(
    {
      id,
      fullname,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "2d",
    }
  );
  return { accessToken, refreshToken };
}

module.exports = generateTokens;
