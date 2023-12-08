const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('elections', {
    electionID: {
      autoIncrement: true,
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
    title: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    questionQuantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sharelink: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    electionCode: {
      type: DataTypes.STRING(100),
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
