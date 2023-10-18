const express = require("express");
const { default: helmet } = require("helmet");
const app = express();
const morgan = require("morgan");
const compression = require("compression");
const dbConnect = require("./configs/database");

//init middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // log requests to the console
app.use(helmet()); // secure apps by setting various HTTP headers
app.use(compression()); // compress all responses, gzip compression, reduce size of response body

//init db
const db = dbConnect;
db.authenticate()
  .then(() => {
    console.log("Database connect...");
  })
  .catch((err) => {
    console.log("Connect error: " + err);
  });

//init routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

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
    stack: process.env.NODE_ENV === "production" ? "" : err.stack,
    message: err.message || "Internal server error",
  });
});

module.exports = app;
