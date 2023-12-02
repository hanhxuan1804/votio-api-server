//answers.repo.js
const { BadRequestResponseError } = require("../../core/error.response");
const { models } = require("../../configs/database");
const { answers, choices } = models;
const { checkQuestionExist } = require("./question.repo");
const { getAnswerChoiceByAnswerID } = require("./answer_choice.repo.js");

const updateOrInsertAnswer = async ({ answerID, questionID }) => {
  //pre check question exist
  if ((await checkQuestionExist({ questionID: questionID })) === false) {
    throw new BadRequestResponseError({ message: "Question not found" });
  }
  if (answerID === undefined) {
    const answer = await answers.create({
      questionID: questionID,
    });
    return answer.dataValues;
  }
  const answer = await answers.findOne({
    where: {
      answerID: answerID,
    },
  });
  if (answer) {
    await answer.update({
      questionID: questionID,
    });
    return answer.dataValues;
  } else {
    const answer = await answers.create({
      questionID: questionID,
    });
    return answer.dataValues;
  }
};

const checkAnswerExist = async ({ answerID }) => {
  const answer = await answers.findOne({
    where: {
      answerID: answerID,
    },
  });
  if (answer) {
    return true;
  } else {
    return false;
  }
};

const getAnswerResult = async ({ questionID }) => {
  const answersList = await answers.findAll({
    where: {
      questionID: questionID,
    },
  });
  if (!answersList) {
    return {
      numberOfAnswer: 0,
    };
  }
  const choiceID = await Promise.all(
    answersList.map(async (answer) => {
      const ac = await getAnswerChoiceByAnswerID({ answerID: answer.answerID });
      return ac;
    })
  );
  const choiceValue = await choices.findAll({
    where: {
      questionID: questionID,
    },
  });
  const choiceList = choiceValue.map((choice) => {
    return {
      choiceID: choice.choiceID,
      content: choice.content,
      numberOfVote: choiceID.filter((choiceID) => {
        return choiceID.includes(choice.choiceID);
      }).length,
    };
  });
  return {
    questionID: questionID,
    numberOfAnswer: answersList.length,
    choices: choiceList,
  };
};

module.exports = {
  updateOrInsertAnswer,
  checkAnswerExist,
  getAnswerResult,
};
