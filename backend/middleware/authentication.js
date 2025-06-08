const { verifyToken } = require("../helpers/jwt");
const { Employee } = require("../models");
async function authentication(req, res, next) {
  const cookies = req.cookies;
  if (!cookies) {
    throw { name: "Unauthorized", message: "invalid token" };
  }

  const token = cookies.access_token;
  if (!token) {
    throw { name: "Unauthorized", message: "invalid token" };
  }

  try {
    const { id } = verifyToken(token);
    const employee = await Employee.findByPk(id);

    if (!employee) {
      throw { name: "Unauthorized", message: "invalid token" };
    }

    req.employee = { id: employee.id, role: employee.role };
    next();
  } catch (error) {
    next(error);
  }
}
module.exports = authentication;
