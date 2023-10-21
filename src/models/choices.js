const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('choices', {
    choiceID: {
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
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'choices',
    timestamps: true,
    paranoid: true,
    timestamp: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "choiceID" },
        ]
      },
      {
        name: "FK_question_choice",
        using: "BTREE",
        fields: [
          { name: "questionID" },
        ]
      },
    ]
  });
};
