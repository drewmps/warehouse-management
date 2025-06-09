import React, { useEffect, useState } from "react";
import axios from "axios";
import { getBaseURL } from "../helpers/api";
import { useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";

export default function EditProductPage() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState(1);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("access_token");
      const formData = new FormData();
      formData.append("file", image);
      formData.append("name", name);
      formData.append("price", price);
      formData.append("categoryId", categoryId);
      setIsLoading(true);

      await axios.put(`${getBaseURL()}/products/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        icon: "success",
        text: "Product has been successfully edited",
      });
      navigate("/");
    } catch (error) {
      setIsLoading(false);
      Swal.fire({
        icon: "error",
        title: error.response.data.status,
        text: error.response.data.message,
      });
    }
  };

  async function fetchProduct() {
    try {
      const { data } = await axios.get(getBaseURL() + `/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      setName(data.name);
      setPrice(data.price);
      setCategoryId(data.categoryId);
    } catch (error) {
      console.log(error.response);
      Swal.fire({
        icon: "error",
        title: error.response.data.status,
        text: error.response.data.message,
      });
    }
  }
  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-black"></div>
        </div>
      ) : (
        <div className="p-6 max-w-xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label font-semibold">Name</label>
              <input
                type="text"
                className="input input-bordered"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label font-semibold">Price</label>
              <input
                type="number"
                className="input input-bordered"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label font-semibold">Category</label>
              <select
                className="select select-bordered"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">-- Select Category --</option>
                {[
                  { id: 1, name: "Category 1" },
                  { id: 2, name: "Category 2" },
                  { id: 3, name: "Category 3" },
                  { id: 4, name: "Category 4" },
                  { id: 5, name: "Category 5" },
                ].map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label font-semibold">Image</label>
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>

            <button className="btn w-full mt-4" type="submit">
              Edit Product
            </button>
          </form>
        </div>
      )}
    </>
  );
}
