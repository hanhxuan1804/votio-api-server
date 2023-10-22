const { models } = require("../configs/database");
const elections = models.elections;
const {
  InternalServerError,
  BadRequestResponeError,
} = require("../core/error.response");
const { getElectionById } = require("../models/repositories/elections.repo");
const { getInfoData } = require("../utils");
const QuestionService = require("./question.service");
class ElectionService {
  static createElection = async ({ user, data }) => {
    if (
      !user ||
      data.kindElection === undefined ||
      data.questions === undefined
    ) {
      throw new BadRequestResponeError({ message: "Invalid data" });
    }

    const newElection = await elections.create({
      accountID: user,
      kindElection: data.kindElection,
    });

    if (!newElection) {
      throw new InternalServerError({ message: "Create election failed" });
    }

    const questions = await Promise.all(
      data.questions.map(async (question) => {
        return await QuestionService.createQuestion({
          electionID: newElection.electionID,
          content: question.content,
          choices: question.choices,
        });
      })
    );
    const res = {
      election: {
        ...getInfoData({
          fields: ["electionID", "kindElection"],
          object: newElection,
        }),
        questions: questions.map((question) => {
          return {
            ...getInfoData({
              fields: ["questionID", "content"],
              object: question.question,
            }),
            choices: question.choices.map((choice) => {
              return {
                ...getInfoData({
                  fields: ["choiceID", "content"],
                  object: choice,
                }),
              };
            }),
          };
        }),
      },
    };
    return res;
  };

  static getElectionById = async ({ id }) => {
    if (!id) {
      throw new BadRequestResponeError({ message: "Invalid data" });
    }
    return getElectionById({ id });
  };
}

module.exports = ElectionService;
