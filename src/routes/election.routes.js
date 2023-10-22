const router = require("express").Router();
const asyncHandler = require("../helpers/asyncHandler");
const { verifyToken } = require("../middlewares/auth");

const electionController = require("../controllers/election.controller");
router.get("/", (req, res) => {
  res.send("Election API is running");
});
router.use(verifyToken);
router.post("/create", asyncHandler(electionController.createElection));
router.get("/get", asyncHandler(electionController.getElection));
router.get("/get/:id", asyncHandler(electionController.getElectionById));
router.put("/update/:id", asyncHandler(electionController.updateElection));
router.put("/delete/:id", asyncHandler(electionController.deleteElection));
router.post("/vote/:id", asyncHandler(electionController.voteElection));
router.post("/result/:id", asyncHandler(electionController.resultElection));
router.post(
  "/getresult/:id",
  asyncHandler(electionController.getResultElection)
);

module.exports = router;
