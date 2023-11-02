const { forEach } = require("lodash");
const { models } = require("../../configs/database");
const { updateListChoice } = require("./choice.repo");
const { getInfoData, removeNullInArray } = require("../../utils");
const { questions, choices } = models;

const getQuestionByElectionID = async (electionID) => {
  const question = await questions.findAll({
    where: {
      electionID: electionID,
    },
    atributes: ["questionID", "content"],
    include: [
      {
        model: choices,
        as: "choices",
        atributes: ["choiceID", "content"],
      },
    ],
  });
  return question;
};

const updateListQuestion = async ({ electionID, list }) => {
  //update question exist
  const updates = await questions
    .findAll({
      where: {
        electionID: electionID,
      },
    })
    .then(async (questions) => {
      const listId = list.map((question) => question.questionID);
      return await Promise.all(
        questions.map(async (question) => {
          if (!listId.includes(question.questionID)) {
            updateListChoice({
              questionID: question.questionID,
              list: [],
            });
            question.destroy();
            return null;
          } else {
            const updateData = list.find(
              (item) => item.questionID === question.questionID
            );
            const questionU = await question.update({
              content: updateData.content,
              choiceQuantity: updateData.choices.length,
              kindQuestion: updateData.kindQuestion,
              isIdentify: updateData.isIdentify,
              startTime: updateData.startTime,
              endTime: updateData.endTime,
            });
            const listChoice = updateData.choices;
            const choiceU = await updateListChoice({
              questionID: question.questionID,
              list: listChoice,
            });
            questionU.choices = choiceU;
            return getInfoData({
              fields: [
                "electionID",
                "questionID",
                "content",
                "choiceQuantity",
                "kindQuestion",
                "isIdentify",
                "startTime",
                "endTime",
                "choices",
              ],
              object: questionU,
            });
          }
        })
      );
    });
  //create question new
  const listNew = list.filter((item) => item.questionID === undefined);
  const news = await Promise.all(
    listNew.map(async (question) => {
      const questionN = await questions.create({
        electionID: electionID,
        content: question.content,
        choiceQuantity: question.choices.length,
        kindQuestion: question.kindQuestion,
        isIdentify: question.isIdentify,
        startTime: question.startTime,
        endTime: question.endTime,
      });
      if (questionN) {
        const choicesN = await Promise.all(
          question.choices.map(async (choice) => {
            const choiceN = await choices.create({
              questionID: questionN.questionID,
              content: choice.content,
            });
            return getInfoData({
              fields: ["choiceID", "content", "questionID"],
              object: choiceN,
            });
          })
        );
        questionN.choices = choicesN;
      }
      return getInfoData({
        fields: [
          "electionID",
          "questionID",
          "content",
          "choiceQuantity",
          "kindQuestion",
          "isIdentify",
          "startTime",
          "endTime",
          "choices",
        ],
        object: questionN,
      });
    })
  );
  return removeNullInArray([...updates, ...news]);
};

module.exports = {
  getQuestionByElectionID,
  updateListQuestion,
};
