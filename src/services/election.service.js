const { models } = require("../configs/database");
const elections = models.elections;
const {
  InternalServerError,
  BadRequestResponseError,
} = require("../core/error.response");
const {
  getElectionById,
  getAllElectionOfUser,
  updateElection,
  deleteElection,
  checkUserOwnElection,
  getElectionByCode,
} = require("../models/repositories/elections.repo");
const { getInfoData } = require("../utils");
const QuestionService = require("./question.service");
class ElectionService {
  static createElection = async ({ user, data }) => {
    if (
      !user ||
      data.questions === undefined ||
      data.questions.length === 0 ||
      !data.title
    ) {
      throw new BadRequestResponseError({ message: "Invalid data" });
    }
    const generateCode = async () => {
      const length = 6;
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      const charactersLength = characters.length;
      do {
        for (let i = 0; i < length; i++) {
          result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
          );
        }
      } while (await elections.findOne({ where: { electionCode: result } }));
      return result;
    };
    const newElection = await elections.create({
      accountID: user,
      questionQuantity: data.questions.length,
      title: data.title,
      sharelink: data.sharelink ? data.sharelink : null,
      electionCode: await generateCode(),
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
          fields: [
            "electionID",
            "questionQuantity",
            "title",
            "sharelink",
            "electionCode",
            "startTime",
            "endTime",
          ],
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
      throw new BadRequestResponseError({ message: "Invalid data" });
    }
    const election = await getElectionById({ id });
    if (!election) {
      throw new BadRequestResponseError({ message: "Get election failed" });
    }
    if (election.accountID !== user) {
      throw new BadRequestResponseError({ message: "Invalid data" });
    }
    return election;
  };

  static getAllElection = async ({ user }) => {
    if (!user) {
      throw new BadRequestResponseError({ message: "Invalid data" });
    }
    //cSpell:disable-next-line
    return await getAllElectionOfUser({ userid: user });
  };

  static updateElection = async ({ id, user, data }) => {
    if (!id || !user || !data) {
      throw new BadRequestResponseError({ message: "Invalid data" });
    }
    if (data.questions === undefined || data.questions.length === 0) {
      throw new BadRequestResponseError({ message: "Invalid data" });
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
  static deleteElection = async ({ id, user }) => {
    if (!id || !user) {
      throw new BadRequestResponseError({ message: "Invalid data" });
    }
    const election = await getElectionById({ id });
    if (!election || election.accountID !== user) {
      throw new BadRequestResponseError({ message: "Invalid data" });
    }
    return await deleteElection({ id });
  };

  static voteElection = async ({ id, data }) => {
    //check data
    if (!id || !data) {
      throw new BadRequestResponseError({ message: "Invalid data" });
    }
    const election = await getElectionById({ id });
    //check election
    if (!election) {
      throw new BadRequestResponseError({ message: "Invalid data" });
    }
    //check time
    const now = new Date();
    if (election.startTime !== null && election.startTime > now) {
      throw new BadRequestResponseError({ message: "Invalid data" });
    }
    if (election.endTime !== null && election.endTime < now) {
      throw new BadRequestResponseError({ message: "Invalid data" });
    }
    //check question
    if (election.questionQuantity !== data.answers.length) {
      throw new BadRequestResponseError({ message: "Invalid data" });
    }
    //check question format and choice
    const questions = await Promise.all(
      data.answers.map(async (answer) => {
        return await QuestionService.voteQuestion({
          questionID: answer.questionID,
          data: answer,
        });
      })
    );
    return {
      election: {
        ...getInfoData({
          fields: [
            "electionID",
            "questionQuantity",
            "title",
            "sharelink",
            "electionCode",
            "startTime",
            "endTime",
          ],
          object: election,
        }),
        answers: questions,
      },
    };
  };
  static getVoteElection = async ({ id, user }) => {
    //check if user is owner
    if (!id || !user) {
      throw new BadRequestResponseError({ message: "Invalid data" });
    }
    const election = await getElectionById({ id });
    if (!election) {
      throw new BadRequestResponseError({ message: "Invalid data" });
    }
    if (election.accountID !== user) {
      throw new BadRequestResponseError({ message: "Invalid data" });
    }
    //get question data
    const answersData = await Promise.all(
      election.questions.map(async (question) => {
        return await QuestionService.getVoteResult({
          questionID: question.questionID,
        });
      })
    );
    return {
      election: {
        ...getInfoData({
          fields: [
            "electionID",
            "questionQuantity",
            "title",
            "sharelink",
            "electionCode",
            "startTime",
            "endTime",
          ],
          object: election,
        }),
        data: answersData,
      },
    };
  };
  static getElectionByCode = async ({ code }) => {
    if (!code) {
      throw new BadRequestResponseError({ message: "Invalid data" });
    }
    return await getElectionByCode({ code });
  };
}

module.exports = ElectionService;
