const { verifyToken } = require("../helpers/jwt");
const { Employee } = require("../models");
async function authentication(req, res, next) {
  const bearerToken = req.headers.authorization;
  if (!bearerToken) {
    throw { name: "Unauthorized", message: "invalid token" };
  }

  const [, token] = bearerToken.split(" ");
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
