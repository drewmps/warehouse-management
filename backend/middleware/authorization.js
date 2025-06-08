const { Cuisine } = require("../models");
async function authorization(req, res, next) {
  if (req.user.role === "Admin") {
    next();
  } else {
    next({ name: "Forbidden", message: "You are not authorized" });
    return;
  }
}
module.exports = authorization;
