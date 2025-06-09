import React, { useEffect, useState } from "react";
import axios from "axios";
import { getBaseURL } from "../helpers/api";
import Swal from "sweetalert2";
import { Link } from "react-router";

export default function DashboardPage() {
  const [products, setProducts] = useState({
    page: 1,
    data: [],
    totalData: 0,
    totalPage: 0,
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get(`${getBaseURL()}/products?page=${page}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(res.data);
        setTotalPages(res.data.totalPage);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: error.response.data.status,
          text: error.response.data.message,
        });
      }
    };

    fetchProducts();
  }, [page]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`${getBaseURL()}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPage(1);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.response.data.status,
        text: error.response.data.message,
      });
    }
  };
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <Link to={"/add-product"} className="btn">
        Add product
      </Link>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.data?.map((product, idx) => (
              <tr key={product.id}>
                <td>{(page - 1) * limit + idx + 1}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.Category?.name || "-"}</td>
                <td className="flex flex-row gap-2">
                  <Link to={`/edit-product/${product.id}`} className="btn">
                    Edit
                  </Link>
                  <button
                    className="btn"
                    onClick={() => {
                      handleDelete(product.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-6 space-x-4">
        <button
          className="btn btn-outline"
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
        >
          Prev
        </button>
        <span className="btn btn-disabled">
          Page {page} of {totalPages}
        </span>
        <button
          className="btn btn-outline"
          onClick={() => setPage((p) => p + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
