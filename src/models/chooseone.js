const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('chooseone', {
    answerDetailID: {
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
    }
  }, {
    sequelize,
    tableName: 'chooseone',
    timestamps: false,
    paranoid: true,
    timestamp: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "answerDetailID" },
        ]
      },
      {
        name: "answer_chooseOne",
        using: "BTREE",
        fields: [
          { name: "answerID" },
        ]
      },
      {
        name: "choice_chooseOne",
        using: "BTREE",
        fields: [
          { name: "choiceID" },
        ]
      },
    ]
  });
};
