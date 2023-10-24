var DataTypes = require("sequelize").DataTypes;
var _accounts = require("./accounts");
var _answers = require("./answers");
var _choices = require("./choices");
var _chooseone = require("./chooseone");
var _elections = require("./elections");
var _questions = require("./questions");

function initModels(sequelize) {
  var accounts = _accounts(sequelize, DataTypes);
  var answers = _answers(sequelize, DataTypes);
  var choices = _choices(sequelize, DataTypes);
  var chooseone = _chooseone(sequelize, DataTypes);
  var elections = _elections(sequelize, DataTypes);
  var questions = _questions(sequelize, DataTypes);

  elections.belongsTo(accounts, { as: "account", foreignKey: "accountID"});
  accounts.hasMany(elections, { as: "elections", foreignKey: "accountID"});
  chooseone.belongsTo(answers, { as: "answer", foreignKey: "answerID"});
  answers.hasMany(chooseone, { as: "chooseones", foreignKey: "answerID"});
  chooseone.belongsTo(choices, { as: "choice", foreignKey: "choiceID"});
  choices.hasMany(chooseone, { as: "chooseones", foreignKey: "choiceID"});
  answers.belongsTo(elections, { as: "election", foreignKey: "electionID"});
  elections.hasMany(answers, { as: "answers", foreignKey: "electionID"});
  questions.belongsTo(elections, { as: "election", foreignKey: "electionID"});
  elections.hasMany(questions, { as: "questions", foreignKey: "electionID"});
  choices.belongsTo(questions, { as: "question", foreignKey: "questionID"});
  questions.hasMany(choices, { as: "choices", foreignKey: "questionID"});

  return {
    accounts,
    answers,
    choices,
    chooseone,
    elections,
    questions,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
