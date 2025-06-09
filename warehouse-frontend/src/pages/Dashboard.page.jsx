import React, { useEffect, useState } from "react";
import axios from "axios";
import { getBaseURL } from "../helpers/api";

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
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, [page]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {products.data?.map((product, idx) => (
              <tr key={product.id}>
                <td>{(page - 1) * limit + idx + 1}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.Category?.name || "-"}</td>
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
