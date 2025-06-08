"use strict";
const { Model } = require("sequelize");
const { hashPassword } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Employee.init(
    {
      email: {
        type: DataTypes.STRING,
        unique: {
          msg: "email is already registered",
        },
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "email is required",
          },
          notNull: {
            msg: "email is required",
          },
          isEmail: {
            msg: "email must be of format email",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "password is required",
          },
          notNull: {
            msg: "password is required",
          },
          len: {
            args: [5, Infinity],
            msg: "minimal password length is 5 characters",
          },
        },
      },
      role: { type: DataTypes.STRING, defaultValue: "Staff" },
    },
    {
      sequelize,
      modelName: "Employee",
    }
  );

  Employee.beforeCreate((employee) => {
    const hashedPassword = hashPassword(employee.password);
    employee.password = hashedPassword;
  });
  return Employee;
};
