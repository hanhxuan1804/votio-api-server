const { models } = require("../../configs/database");
const { UnauthorizedResponseError } = require("../../core/error.response");
const {
  removeNullAndUndefinedNestedObject,
  getInfoData,
} = require("../../utils");
const { updateListQuestion, deleteListQuestion } = require("./question.repo");
const { elections, questions, choices } = models;

const getElectionById = async ({ id }) => {
  return await elections.findOne({
    where: {
      electionID: id,
    },
    atributes: ["electionID", "kindElection"],
    include: [
      {
        model: questions,
        as: "questions",
        atributes: ["questionID", "content"],
        include: [
          {
            model: choices,
            as: "choices",
            atributes: ["choiceID", "content"],
          },
        ],
      },
    ],
  });
};
const getAllElectionOfUser = async ({ userid }) => {
  return await elections.findAll({
    where: {
      accountID: userid,
    },
    atributes: ["electionID", "kindElection"],
    include: [
      {
        model: questions,
        as: "questions",
        atributes: ["questionID", "content"],
        include: [
          {
            model: choices,
            as: "choices",
            atributes: ["choiceID", "content"],
          },
        ],
      },
    ],
  });
};
const updateElection = async ({ id, user, data }) => {
  const updateData = removeNullAndUndefinedNestedObject(data);
  await elections.update(
    {
      questionQuantity: updateData.questionQuantity,
      startTime: updateData.startTime,
      endTime: updateData.endTime,
    },
    {
      where: {
        electionID: id,
        accountID: user,
      },
    }
  );
  const electionU = await getElectionById({ id });
  if (!electionU || electionU.accountID !== user) {
    throw new UnauthorizedResponseError({ message: "Invalid data" });
  }
  const questionU = await updateListQuestion({
    electionID: id,
    list: data.questions,
  });
  electionU.questions = questionU;
  return getInfoData({
    fields: [
      "electionID",
      "questionQuantity",
      "startTime",
      "endTime",
      "questions",
    ],
    object: electionU,
  });
};
const deleteElection = async ({ id }) => {
  await deleteListQuestion({ electionID: id });
  await elections.destroy({
    where: {
      electionID: id,
    },
  });
  return true;
};
const checkUserOwnElection = async ({ id, user }) => {
  const election = await elections.findOne({
    where: {
      electionID: id,
    },
  });
  if (!election) {
    return false;
  }
  if (election.accountID !== user) {
    return false;
  }
  return true;
};

module.exports = {
  getElectionById,
  getAllElectionOfUser,
  updateElection,
  deleteElection,
  checkUserOwnElection,
};
