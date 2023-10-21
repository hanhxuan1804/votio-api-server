const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('questions', {
    questionID: {
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
