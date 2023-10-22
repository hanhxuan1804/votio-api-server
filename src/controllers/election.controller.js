const { CreatedResponse, OkResponse } = require("../core/success.response");

const ElectionService = require("../services/election.service");
class ElectionController {
  createElection = async (req, res, next) => {
    console.log(`[POST]::createElection`, req.body);
    new CreatedResponse({
      message: "Create election successfully",
      metadata: await ElectionService.createElection({user: req.id, data: req.body}),
    }).send(res);
  };
  getElectionById = async (req, res, next) => {
    console.log(`[GET]::getElectionById`, req.params);
    new OkResponse({
      message: "Get election successfully",
      metadata: await ElectionService.getElectionById({id: req.params.id}),
    }).send(res);
  };
}

module.exports = new ElectionController();
