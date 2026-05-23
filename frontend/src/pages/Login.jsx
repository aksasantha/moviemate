import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../api/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/login",
        formData
      );

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      alert("Login successful");

      navigate("/dashboard");

    } catch (error) {
      console.error(error);

      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-80"
      >
        <h1 className="text-4xl font-bold">
          MovieMate
        </h1>

        <p className="text-zinc-400">
          Welcome back
        </p>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="p-3 rounded bg-zinc-900 outline-none"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="p-3 rounded bg-zinc-900 outline-none"
        />

        <button
          type="submit"
          className="bg-white text-black p-3 rounded font-semibold"
        >
          Login
        </button>

        <Link
          to="/register"
          className="text-sm text-zinc-400 text-center"
        >
          Don’t have an account? Register
        </Link>
      </form>
    </div>
  );
}

export default Login;