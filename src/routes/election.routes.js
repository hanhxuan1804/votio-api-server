const router = require("express").Router();
const asyncHandler = require("../helpers/asyncHandler");
const { verifyToken } = require("../middlewares/auth");

const electionController = require("../controllers/election.controller");
router.use(verifyToken);
router.post("/", asyncHandler(electionController.createElection));
router.get("/", asyncHandler(electionController.getAllElection));
router.get("/:id", asyncHandler(electionController.getElectionById));
router.patch("/:id", asyncHandler(electionController.updateElection));

router.put("/delete/:id", asyncHandler(electionController.deleteElection));
router.post("/vote/:id", asyncHandler(electionController.voteElection));
router.post("/result/:id", asyncHandler(electionController.resultElection));
router.post(
  "/getresult/:id",
  asyncHandler(electionController.getResultElection)
);

module.exports = router;
