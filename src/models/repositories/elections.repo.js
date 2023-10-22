const {models} = require('../../configs/database');
const {elections, questions, choices} = models;

const getElectionById = async ({id}) => {
    return await elections.findOne({
        where: {
            electionID: id,
        },
        atributes: [
            'electionID',
            'kindElection',
        ],
        include: [
            {
                model: questions,
                as: 'questions',
                atributes: [
                    'questionID',
                    'content',
                ],
                include: [
                    {
                        model: choices,
                        as: 'choices',
                        atributes: [
                            'choiceID',
                            'content',
                        ],
                    }
                ]
            }
        ]
    });
}

module.exports = {
    getElectionById,
}
