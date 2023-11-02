const {models} = require('../configs/database');
const questions = models.questions;
const {InternalServerError,
    BadRequestResponeError,
} = require('../core/error.response');
const ChoiceService = require('./choice.service');

class QuestionService {
    static createQuestion = async ({electionID, 
        content, 
        choices,
        choiceQuantity,
        kindQuestion,
        isIdentify,
        startTime,
        endTime,
    }) => {
        if (!electionID || !content || !choices || !kindQuestion) {
            throw new BadRequestResponeError({message: "Invalid data"});
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