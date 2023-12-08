//answer_choice.repo.js
const { models } = require("../../configs/database");
const { answer_choice } = models;
const { checkChoiceExist } = require("./choice.repo");
const { BadRequestResponseError } = require("../../core/error.response");
const { findChoiceById } = require("./choice.repo");

const updateOrInsertAnswerChoice = async ({
  answerChoiceId,
  answerID,
  choiceID,
}) => {
  if ((await checkChoiceExist({ choiceID: choiceID })) === false) {
    throw new BadRequestResponseError({
      message: "Choice or answer not found",
    });
  }
  if (answerChoiceId === undefined) {
    const ac = await answer_choice.create({
      answerID: answerID,
      choiceID: choiceID,
    });
    return ac.dataValues;
  }
  const answerChoice = await answer_choice.findOne({
    where: {
      answerChoiceID: answerChoiceId,
    },
  });
  if (answerChoice) {
    await answerChoice.update({
      answerID: answerID,
      choiceID: choiceID,
    });
    return answerChoice.dataValues;
  } else {
    const ac = await answer_choice.create({
      answerID: answerID,
      choiceID: choiceID,
    });
    return ac.dataValues;
  }
};

const getAnswerChoiceByAnswerID = async ({ answerID }) => {
  const choices = await answer_choice.findAll({
    where: {
      answerID: answerID,
    },
  });
  if (!choices) {
    return {
      numberOfChoices: 0,
    };
  }
  return choices.map((choice) => {
    return choice.choiceID;
  });
};

module.exports = {
  updateOrInsertAnswerChoice,
  getAnswerChoiceByAnswerID,
};
