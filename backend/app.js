if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const EmployeeController = require("./controllers/EmployeeController");
const errorHandler = require("./middleware/errorHandler");
const ProductController = require("./controllers/ProductController");
const authentication = require("./middleware/authentication");
const multerInit = require("./helpers/multerHelper");
const helmet = require("helmet");
const authorization = require("./middleware/authorization");
const cookieParser = require("cookie-parser");

app.use(cors());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      connectSrc: ["'self'", "https://api.cloudinary.com"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  })
);

app.use(cookieParser());

const upload = multerInit();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/login", EmployeeController.login);

app.use(authentication);
app.post("/register", EmployeeController.addEmployee);
app.get("/products", ProductController.getProducts);
app.get("/products/:id", ProductController.getProductById);

app.post("/products", upload.single("file"), ProductController.createProduct);
app.delete("/products/:id", authorization, ProductController.deleteProductById);
app.put(
  "/products/:id",
  authorization,
  upload.single("file"),
  ProductController.editProductById
);

app.use(errorHandler);
module.exports = app;
