const router = require("express").Router();
const asyncHandler = require("../helpers/asyncHandler");
const { verifyToken } = require("../middlewares/auth");

const electionController = require("../controllers/election.controller");
router.post("/:id/vote", asyncHandler(electionController.voteElection));

router.use(verifyToken);
router.post("/", asyncHandler(electionController.createElection));
router.get("/", asyncHandler(electionController.getAllElection));
router.get("/:id", asyncHandler(electionController.getElectionById));
router.patch("/:id", asyncHandler(electionController.updateElection));
router.delete("/:id", asyncHandler(electionController.deleteElection));
router.get("/:id/vote", asyncHandler(electionController.getVoteElection));


module.exports = router;
