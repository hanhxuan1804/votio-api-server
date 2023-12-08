const { models } = require("../configs/database");
const questions = models.questions;
const {
  InternalServerError,
  BadRequestResponseError,
} = require("../core/error.response");
const {
  updateOrInsertAnswerChoice,
} = require("../models/repositories/answer_choice.repo");
const { updateOrInsertAnswer, getAnswerResult } = require("../models/repositories/answers.repo");
const ChoiceService = require("./choice.service");

class QuestionService {
  static createQuestion = async ({
    electionID,
    content,
    choices,
    choiceQuantity,
    kindQuestion,
    isIdentify,
    startTime,
    endTime,
  }) => {
    if (!electionID || !content || !choices || !kindQuestion) {
      throw new BadRequestResponseError({ message: "Invalid data" });
    }
    const newQuestion = await questions.create({
      electionID: electionID,
      content: content,
      choiceQuantity: choiceQuantity,
      kindQuestion: kindQuestion,
      isIdentify: isIdentify,
      startTime: startTime,
      endTime: endTime,
    });
    if (!newQuestion) {
      throw new InternalServerError({ message: "Create question failed" });
    }
    const newchoices = await Promise.all(
      choices.map(async (choice) => {
        return await ChoiceService.createChoice({
          questionID: newQuestion.questionID,
          content: choice.content,
        });
      })
    );
    return {
      question: newQuestion,
      choices: newchoices,
    };
  };
  static voteQuestion = async ({ questionID, data }) => {
    if (!questionID || !data) {
      throw new BadRequestResponseError({ message: "Invalid data" });
    }
    const question = await questions.findOne({
      where: {
        questionID: questionID,
      },
    });
    if (!question) {
      throw new BadRequestResponseError({ message: "Question not found" });
    }
    //check time
    const now = new Date();
    if (question.startTime !== null && question.startTime > now) {
      throw new BadRequestResponseError({ message: "Election not started" });
    }
    if (question.endTime !== null && question.endTime < now) {
      throw new BadRequestResponseError({ message: "Election ended" });
    }
    const dataChoices = data.choices;
    const newAnswer = await updateOrInsertAnswer({
      answerID: data.answerID,
      questionID: questionID,
    });
    console.log('newAS',newAnswer.answerID);
    if (!newAnswer) {
      throw new InternalServerError({ message: "Create answer failed" });
    }
    const newChoices = await Promise.all(
      dataChoices.map(async (choice) => {
        return await updateOrInsertAnswerChoice({
          answerID: newAnswer.answerID,
          choiceID: choice.choiceID,
        });
      })
    );
    return {
      answerID: newAnswer.answerID,
      questionID: questionID,
      choices: newChoices,
    };
  };

  static getVoteResult = async ({ questionID }) => {
    if (!questionID) {
      throw new BadRequestResponseError({ message: "Invalid data" });
    }
    const question = await questions.findOne({
      where: {
        questionID: questionID,
      },
    });
    if (!question) {
      throw new BadRequestResponseError({ message: "Question not found" });
    }
    const result = await getAnswerResult({ questionID: questionID });
    return result;
  }
}

module.exports = QuestionService;
