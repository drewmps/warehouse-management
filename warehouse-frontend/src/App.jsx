import { BrowserRouter, Route, Routes } from "react-router";
import LoginPage from "./pages/Login.page";
import PublicRoute from "./guards/PublicRoute";
import PrivateRoute from "./guards/PrivateRoute";
import DashboardPage from "./pages/Dashboard.page";
import AddProductPage from "./pages/AddProduct.page";
import EditProductPage from "./pages/EditProduct.page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/add-product" element={<AddProductPage />} />
          <Route path="edit-product/:id" element={<EditProductPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
