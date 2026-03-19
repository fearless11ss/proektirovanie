const { DataTypes, Model } = require("sequelize");
const bcrypt = require("bcryptjs");
const { sequelizeInstance } = require("..");

class User extends Model {
  async checkPassword(plain) {
    return bcrypt.compare(plain, this.password);
  }

  toSafeJSON() {
    const values = { ...this.get() };
    delete values.password;
    return values;
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Клиент"
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ""
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user"
    }
  },
  {
    sequelize: sequelizeInstance,
    underscored: true,
    modelName: "user",
    tableName: "users",
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  }
);

module.exports = User;
