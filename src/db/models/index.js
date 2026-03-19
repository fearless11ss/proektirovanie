const User = require("./User");
const Request = require("./Request");

User.hasMany(Request, {
  foreignKey: {
    name: "userId",
    allowNull: false
  },
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});

Request.belongsTo(User, {
  foreignKey: {
    name: "userId",
    allowNull: false
  }
});

module.exports = {
  User,
  Request
};
