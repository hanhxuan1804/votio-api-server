require("dotenv").config();
const express = require("express");
const { default: helmet } = require("helmet");
const app = express();
const morgan = require("morgan");
const compression = require("compression");
const { testConnect } = require("./configs/database");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

//swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Voting App API",
      description: "This is voting app API created by DHH Team",
      contact: {
        name: "DHH Team",
      },
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Development server",
      },
      {
        url: "https://votio.onrender.com",
        description: "Production server",
      }
    ],
  },
  apis: ["./src/routes/*.js", "./src/routes.js"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

//init middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // log requests to the console
app.use(helmet()); // secure apps by setting various HTTP headers
app.use(compression()); // compress all responses, gzip compression, reduce size of response body

//init db
// database autoconnect when require database js
testConnect();

// tesing create data
// const createUser = async (data) => {
//   let newUser = await models.accounts.create(data);
//   console.log(newUser instanceof models.accounts);
//   console.log(newUser);
// };
// let data = {
//   //accountID: 3,
//   fullname: "Nhieu Gia Hao 2",
//   pass: "123456",
//   email: "shinobihao2001@gmail.com",
//   isAdmin: 1,
// };
// createUser(data);

//init routes
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/v1/api", require("./routes"));

//handle errors
app.use((req, res, next) => {
  const error = new Error("Resource not found");
  error.status = 404;
  next(error);
});
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    status: "error",
    code: statusCode,
    stack: process.env.NODE_ENV === "prod" ? "" : err.stack,
    message: err.message || "Internal server error",
  });
});

module.exports = app;
