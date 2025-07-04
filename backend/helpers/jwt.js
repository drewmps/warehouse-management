var jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
function signToken(data) {
  return jwt.sign(data, SECRET_KEY, { expiresIn: 3600 });
}

function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY);
}

module.exports = {
  signToken,
  verifyToken,
};
