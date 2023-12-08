const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('questions', {
    questionID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    electionID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'elections',
        key: 'electionID'
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    kindQuestion: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    choiceQuantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isIdentify: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'questions',
    timestamps: true,
    paranoid: true,
    timestamp: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "questionID" },
        ]
      },
      {
        name: "FK_election_question",
        using: "BTREE",
        fields: [
          { name: "electionID" },
        ]
      },
    ]
  });
};
