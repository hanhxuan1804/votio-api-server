const router = require("express").Router();
const asyncHandler = require("../helpers/asyncHandler");
const accountController = require("../controllers/accountController");

router.post("/login", asyncHandler(accountController.handleLogin));
router.post("/register", asyncHandler(accountController.handleRegister));
router.post(
  "/refreshToken",
  asyncHandler(accountController.refreshAccessToken)
);

module.exports = router;
