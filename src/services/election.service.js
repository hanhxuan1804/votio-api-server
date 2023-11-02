const { models } = require("../configs/database");
const elections = models.elections;
const {
  InternalServerError,
  BadRequestResponeError,
} = require("../core/error.response");
const {
  getElectionById,
  getAllElectionOfUser,
  updateElection,
} = require("../models/repositories/elections.repo");
const { getInfoData } = require("../utils");
const QuestionService = require("./question.service");
class ElectionService {
  static createElection = async ({ user, data }) => {
    if (!user || data.questions === undefined || data.questions.length === 0) {
      throw new BadRequestResponeError({ message: "Invalid data" });
    }

    const newElection = await elections.create({
      accountID: user,
      questionQuantity: data.questions.length,
      startTime: data.startTime,
      endTime: data.endTime,
    });

    if (!newElection) {
      throw new InternalServerError({ message: "Create election failed" });
    }

    const questions = await Promise.all(
      data.questions.map(async (question) => {
        return await QuestionService.createQuestion({
          electionID: newElection.electionID,
          kindQuestion: question.kindQuestion,
          choiceQuantity: question.choices.length,
          isIdentify: question.isIdentify,
          startTime: question.startTime,
          endTime: question.endTime,
          content: question.content,
          choices: question.choices,
        });
      })
    );
    const res = {
      election: {
        ...getInfoData({
          fields: ["electionID", "questionQuantity", "startTime", "endTime"],
          object: newElection,
        }),
        questions: questions.map((question) => {
          return {
            ...getInfoData({
              fields: [
                "questionID",
                "kindQuestion",
                "choiceQuantity",
                "isIdentify",
                "startTime",
                "endTime",
                "content",
              ],
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

  static getElectionById = async ({ id, user }) => {
    if (!id) {
      throw new BadRequestResponeError({ message: "Invalid data" });
    }
    const election = await getElectionById({ id });
    if (!election) {
      throw new BadRequestResponeError({ message: "Get election failed" });
    }
    if (election.accountID !== user) {
      throw new BadRequestResponeError({ message: "Invalid data" });
    }
    return election;
  };

  static getAllElection = async ({ user }) => {
    if (!user) {
      throw new BadRequestResponeError({ message: "Invalid data" });
    }
    return await getAllElectionOfUser({ userid: user });
  };

  static updateElection = async ({ id, user, data }) => {
    if (!id || !user || !data) {
      throw new BadRequestResponeError({ message: "Invalid data" });
    }
    if (data.questions === undefined || data.questions.length === 0) {
      throw new BadRequestResponeError({ message: "Invalid data" });
    }
    data.questionQuantity = data.questionQuantity
      ? data.questionQuantity
      : data.questions.length;
    const electionU = await updateElection({ id, user, data });
    if (!electionU) {
      throw new InternalServerError({ message: "Update election failed" });
    }
    return electionU;
  };
}

module.exports = ElectionService;
