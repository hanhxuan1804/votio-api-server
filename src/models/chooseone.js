const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('chooseone', {
    answerDetailID: {
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
    deleteAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'chooseone',
    timestamps: true,
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
