const { DataTypes, Model } = require("sequelize");
const { sequelizeInstance } = require("..");

class Request extends Model {}

Request.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id"
      }
    },
    deviceBrand: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Unknown"
    },
    deviceModel: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ""
    },
    imei: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ""
    },
    issueDescription: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ""
    },
    status: {
      type: DataTypes.ENUM("new", "diagnostics", "repairing", "ready", "issued", "cancelled"),
      allowNull: false,
      defaultValue: "new"
    },
    estimatedCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    finalCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    sequelize: sequelizeInstance,
    underscored: true,
    modelName: "request",
    tableName: "requests"
  }
);

module.exports = Request;
