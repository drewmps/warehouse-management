const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { Employee } = require("../models");
class EmployeeController {
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email) {
        throw { name: "BadRequest", message: "email is required" };
      }
      if (!password) {
        throw { name: "BadRequest", message: "password is required" };
      }

      const employee = await Employee.findOne({ where: { email } });
      if (!employee) {
        throw { name: "Unauthorized", message: "invalid email or password" };
      }

      const isValidPassword = comparePassword(password, employee.password);
      if (!isValidPassword) {
        throw { name: "Unauthorized", message: "invalid email or password" };
      }

      const access_token = signToken({ id: employee.id });
      res.status(200).json({
        access_token,
        role: employee.role,
      });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = EmployeeController;
