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

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/login", EmployeeController.login);
app.post("/register", EmployeeController.addEmployee);
app.get("/products", ProductController.getProducts);
app.get("/products/:id", ProductController.getProductById);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
