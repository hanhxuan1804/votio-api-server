const router = require("express").Router();
const { AccountRouter, ElectionRouter } = require("./routes/index");
/**
 * @swagger
 * tags:
 *  name: General
 *  description: General API
 * /v1/api:
 *   get:
 *     summary: Test api is running
 *     tags: [General]
 *     description: Use to test api is running
 *     responses:
 *       '200': 
 *          description: A successful response
 *       '500':
 *          description: Internal server error
 */
router.get("/", (req, res) => {
  res.send("API is running");
});
router.use("/auth", AccountRouter);
router.use("/elections", ElectionRouter);

module.exports = router;
