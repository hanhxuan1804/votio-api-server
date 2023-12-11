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
  const updateAttribute = Object.keys(updateData);
  //remove attribute electionID, accountID, electionCode, questions from updateAttribute
  updateAttribute.splice(updateAttribute.indexOf("electionID"), 1);
  updateAttribute.splice(updateAttribute.indexOf("accountID"), 1);
  updateAttribute.splice(updateAttribute.indexOf("electionCode"), 1);
  updateAttribute.splice(updateAttribute.indexOf("questions"), 1);
  console.log(updateAttribute);
  if (updateAttribute.length === 0) {
    return await getElectionById({ id });
  }
  const electionU = await getElectionById({ id });
  if (!electionU || electionU.accountID !== user) {
    throw new UnauthorizedResponseError({ message: "Invalid data" });
  }
  await electionU.update(updateData, {
    where: {
      electionID: id,
    },
    fields: updateAttribute,
  });
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
      "title",
      "sharelink",
      "electionCode",
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

const getElectionByCode = async ({ code }) => {
  const election = await elections.findOne({
    where: {
      electionCode: code,
      startTime: {
        [Op.lte]: new Date(),
      },
      endTime: {
        [Op.gte]: new Date(),
      },
    },
    atributes: [
      "electionID",
      "title",
      "sharelink",
      "electionCode",
      "questionQuantity",
      "startTime",
      "endTime",
    ],
    include: [
      {
        model: questions,
        as: "questions",
        atributes: [
          "questionID",
          "content",
          "kindQuestion",
          "choiceQuantity",
          "isIdentify",
          "startTime",
          "endTime",
        ],
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
  if (!election) {
    throw new BadRequestResponseError({ message: "Invalid data. The election is not exist or not available" });
  }
  return election
};

module.exports = {
  getElectionById,
  getAllElectionOfUser,
  updateElection,
  deleteElection,
  checkUserOwnElection,
  getElectionByCode,
};
