var DataTypes = require("sequelize").DataTypes;
var _accounts = require("./accounts");
var _answer_choice = require("./answer_choice");
var _answers = require("./answers");
var _choices = require("./choices");
var _elections = require("./elections");
var _questions = require("./questions");

function initModels(sequelize) {
  var accounts = _accounts(sequelize, DataTypes);
  var answer_choice = _answer_choice(sequelize, DataTypes);
  var answers = _answers(sequelize, DataTypes);
  var choices = _choices(sequelize, DataTypes);
  var elections = _elections(sequelize, DataTypes);
  var questions = _questions(sequelize, DataTypes);

  elections.belongsTo(accounts, { as: "account", foreignKey: "accountID"});
  accounts.hasMany(elections, { as: "elections", foreignKey: "accountID"});
  answer_choice.belongsTo(answers, { as: "answer", foreignKey: "answerID"});
  answers.hasMany(answer_choice, { as: "answer_choices", foreignKey: "answerID"});
  answer_choice.belongsTo(choices, { as: "choice", foreignKey: "choiceID"});
  choices.hasMany(answer_choice, { as: "answer_choices", foreignKey: "choiceID"});
  questions.belongsTo(elections, { as: "election", foreignKey: "electionID"});
  elections.hasMany(questions, { as: "questions", foreignKey: "electionID"});
  answers.belongsTo(questions, { as: "question", foreignKey: "questionID"});
  questions.hasMany(answers, { as: "answers", foreignKey: "questionID"});
  choices.belongsTo(questions, { as: "question", foreignKey: "questionID"});
  questions.hasMany(choices, { as: "choices", foreignKey: "questionID"});

  return {
    accounts,
    answer_choice,
    answers,
    choices,
    elections,
    questions,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
