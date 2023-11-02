const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('answer_choice', {
    answerChoiceID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    answerID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'answers',
        key: 'answerID'
      }
    },
    choiceID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'choices',
        key: 'choiceID'
      }
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'answer_choice',
    timestamps: true,
    paranoid: true,
    timestamp: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "answerChoiceID" },
        ]
      },
      {
        name: "FK_answer_choice_answer",
        using: "BTREE",
        fields: [
          { name: "answerID" },
        ]
      },
      {
        name: "FK_answer_choice_choice",
        using: "BTREE",
        fields: [
          { name: "choiceID" },
        ]
      },
    ]
  });
};
