const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('answers', {
    answerID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    questionID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'questions',
        key: 'questionID'
      }
    },
    identity: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'answers',
    timestamps: true,
    paranoid: true,
    timestamp: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "answerID" },
        ]
      },
      {
        name: "FK_question_answer",
        using: "BTREE",
        fields: [
          { name: "questionID" },
        ]
      },
    ]
  });
};
