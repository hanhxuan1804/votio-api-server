const router = require("express").Router();
const { AccountRouter, ElectionRouter } = require("./routes/index");

router.get("/", (req, res) => {
  res.send("API is running");
});
router.use("/auth", AccountRouter);
router.use("/elections", ElectionRouter);

module.exports = router;
