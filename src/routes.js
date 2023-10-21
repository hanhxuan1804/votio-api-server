const router = require("express").Router();
const { AccountRouter, ElectionRouter } = require("./routes/index");

router.use("/auth", AccountRouter);
router.use("/election", ElectionRouter);

module.exports = router;
