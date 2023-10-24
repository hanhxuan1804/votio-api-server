const {models} = require('../configs/database');
const questions = models.questions;
const {InternalServerError} = require('../core/error.response');
const ChoiceService = require('./choice.service');

class QuestionService {
    static createQuestion = async ({electionID, content, choices}) => {
        const newQuestion = await questions.create({
            electionID: electionID,
            content: content,
        });
        if (!newQuestion) {
            throw new InternalServerError({message: "Create question failed"});
        }
        const newchoices = await Promise.all(choices.map(async (choice) => {
            return await ChoiceService.createChoice({
                questionID: newQuestion.questionID,
                content: choice.content,
            });
        }
        ));
        return {
            question: newQuestion,
            choices: newchoices,
        }
    }
}

module.exports = QuestionService;