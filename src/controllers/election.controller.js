const { CreatedResponse } = require("../core/success.response");

const electionService = require("../services/election.service");
class ElectionController {
  createElection = async (req, res, next) => {
    console.log(`[POST]::createElection`, req.body);
    new CreatedResponse({
      message: "Create election successfully",
      metadata: await electionService.createElection({user: req.id, data: req.body}),
    }).send(res);
  };
}

module.exports = new ElectionController();
