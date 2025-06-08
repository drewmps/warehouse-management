const multer = require("multer");
function errorHandler(err, req, res, next) {
  console.log("🚀 ~ errorHandler ~ err:", err);
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "File too large. Max 1MB allowed." });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ message: "Only 1 file is allowed" });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        message: "Only .jpeg, .png, and .webp files are allowed.",
      });
    }
    return res.status(400).json({ message: err.message });
  }
  switch (err.name) {
    case "SequelizeValidationError":
    case "SequelizeUniqueConstraintError":
      res.status(400).json({
        message: err.errors[0].message,
      });
      return;
    case "BadRequest":
      res.status(400).json({
        message: err.message,
      });
      return;
    case "Unauthorized":
      res.status(401).json({ message: err.message });
      return;
    case "Forbidden":
      res.status(403).json({ message: err.message });
      return;
    case "NotFound":
      res.status(404).json({ message: err.message });
      return;
    case "JsonWebTokenError":
      res.status(401).json({ message: "invalid token" });
      return;
    default:
      res.status(500).json({ message: "internal server error" });
  }
}
module.exports = errorHandler;
