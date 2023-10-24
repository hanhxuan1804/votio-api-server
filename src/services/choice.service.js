const {models} = require('../configs/database');
const choices = models.choices;

class ChoiceService {
    static createChoice = async ({questionID, content}) => {
        const newChoice = await choices.create({
            questionID: questionID,
            content: content,
        });
        if (!newChoice) {
            throw new InternalServerError({message: "Create choice failed"});
        }
        return newChoice;
    }
}

module.exports = ChoiceService;