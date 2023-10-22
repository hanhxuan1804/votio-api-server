const { models } = require('../configs/database');
const elections = models.elections;
const { InternalServerError, BadRequestResponeError } = require('../core/error.response');
const QuestionService = require('./question.service');
class ElectionService {
    static createElection = async ({ user, data }) => {
        if (!user || data.kindElection === undefined || data.questions === undefined) {
            throw new BadRequestResponeError({ message: "Invalid data" });
        }

        const newElection = await elections.create({
            accountID: user,
            kindElection: data.kindElection,
        });

        if (!newElection) {
            throw new InternalServerError({ message: "Create election failed" });
        }

        const questions = await Promise.all(data.questions.map(async (question) => {
            return await QuestionService.createQuestion({
                electionID: newElection.electionID,
                content: question.content,
                choices: question.choices,
            });
        }));

        return {
            election: newElection,
            questions: questions,
        };
    }

}

module.exports = ElectionService;