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

app.use(
  cors({
    origin: ["http://localhost:5173", "https://your-frontend.com"], // your frontend URLs
    credentials: true, // if sending cookies or auth headers
  })
);
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

app.use(errorHandler);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
