const multer = require("multer");
const multerInit = () =>
  multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 1 * 1024 * 1024,
      files: 1,
    },

    fileFilter: (req, file, cb) => {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Invalid file type")
        );
      }
    },
  });
module.exports = multerInit;
