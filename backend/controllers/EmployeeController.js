const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { Employee } = require("../models");
class EmployeeController {
  static async getCurrentlyLoggedInEmployee(req, res, next) {
    res.json({
      id: req.user.id,
      role: req.user.role,
    });
  }
  static async addEmployee(req, res, next) {
    try {
      const { email, password } = req.body;

      await Employee.create({
        email,
        password,
      });
      res.status(201).json({ message: "a new employee has been added" });
    } catch (error) {
      next(error);
    }
  }
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

      res.cookie("access_token", access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 60 * 60 * 1000,
      });

      res.status(200).json({
        role: employee.role,
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    res.cookie("access_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 0,
    });
    res.status(200).json({ message: "Logged out successfully" });
  }
}
module.exports = EmployeeController;
