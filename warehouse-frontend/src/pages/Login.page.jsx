import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { getBaseURL } from "../helpers/api";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  async function handleLogin(e) {
    e.preventDefault();
    try {
      const response = await axios.post(getBaseURL() + "/login", {
        email,
        password,
      });
      localStorage.setItem("access_token", response.data.access_token);
      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.response.data.status,
        text: error.response.data.message,
      });
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="w-full max-w-md shadow-xl bg-base-100 p-8 rounded-box">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="flex flex-col gap-4 items-center mb-4">
            <div className="w-full">
              <div>
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
              </div>
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>

            <div className="w-full">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
          </div>

          <button type="submit" className="btn w-full">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
