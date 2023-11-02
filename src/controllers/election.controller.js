const { CreatedResponse, OkResponse } = require("../core/success.response");

const ElectionService = require("../services/election.service");
class ElectionController {
  createElection = async (req, res, next) => {
    console.log(`[POST]::createElection`, req.body);
    new CreatedResponse(
      "Create election successfully",
      await ElectionService.createElection({ user: req.id, data: req.body })
    ).send(res);
  };
  getElectionById = async (req, res, next) => {
    console.log(`[GET]::getElectionById`, req.params);
    new OkResponse(
      "Get election successfully",
      await ElectionService.getElectionById({ id: req.params.id, user: req.id })
    ).send(res);
  };
  getAllElection = async (req, res, next) => {
    console.log(`[GET]::getAllElection`);
    new OkResponse(
      "Get all election successfully",
      await ElectionService.getAllElection({ user: req.id })
    ).send(res);
  };
  updateElection = async (req, res, next) => {
    console.log(`[PATCH]::updateElection`, req.params, req.body);
    new OkResponse(
      "Update election successfully",
      await ElectionService.updateElection({
        id: req.params.id,
        user: req.id,
        data: req.body,
      })
    ).send(res);
  };
}

module.exports = new ElectionController();
