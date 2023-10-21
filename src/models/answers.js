const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('answers', {
    answerID: {
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
    deleteAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
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
        name: "FK_election_answer",
        using: "BTREE",
        fields: [
          { name: "electionID" },
        ]
      },
    ]
  });
};
