const dev = {
  DB: {
    HOST: process.env.DB_HOST || "localhost",
    PORT: process.env.DB_PORT || 3306,
    NAME: process.env.DB_NAME || "votio",
    USER: process.env.DB_USER || "root",
    PASS: process.env.DB_PASS || "123456",
  },
};

const prod = {
  DB: {
    HOST: process.env.PRO_DB_HOST || "localhost",
    PORT: process.env.PRO_DB_PORT || 3306,
    NAME: process.env.PRO_DB_NAME || "votio",
    USER: process.env.PRO_DB_USER || "root",
    PASS: process.env.PRO_DB_PASS || "123456",
  },
};

const config = { dev, prod };
const env = process.env.NODE_ENV || "dev";

module.exports = config[env];
