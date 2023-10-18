const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "accounts",
    {
      accountID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      fullname: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "accounts",
      timestamps: false,
      paranoid: true,
      timestamp: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "accountID" }],
        },
      ],
    }
  );
};
