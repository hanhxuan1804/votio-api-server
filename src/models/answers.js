const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('answers', {
    answerID: {
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
    }
  }, {
    sequelize,
    tableName: 'answers',
    timestamps: false,
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
        name: "FK_election_answer",
        using: "BTREE",
        fields: [
          { name: "electionID" },
        ]
      },
    ]
  });
};
