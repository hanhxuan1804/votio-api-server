const router = require("express").Router();
const accountController = require("../controllers/accountController");

router.post("/login", accountController.handleLogin);
router.post("/register", accountController.handleRegister);

module.exports = router;