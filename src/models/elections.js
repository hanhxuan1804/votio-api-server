const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('elections', {
    electionID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    accountID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'accounts',
        key: 'accountID'
      }
    },
    kindElection: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'elections',
    timestamps: true,
    paranoid: true,
    timestamp: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "electionID" },
        ]
      },
      {
        name: "FK_account_election",
        using: "BTREE",
        fields: [
          { name: "accountID" },
        ]
      },
    ]
  });
};
