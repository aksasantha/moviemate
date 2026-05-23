import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../api/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
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
        "/register",
        formData
      );

      alert(response.data.message);

      navigate("/login");

    } catch (error) {
      console.error(error);

      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-80"
      >
        <h1 className="text-4xl font-bold">
          Create Account
        </h1>

        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="p-3 rounded bg-zinc-900 outline-none"
        />

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
          Register
        </button>

        <Link
          to="/login"
          className="text-sm text-zinc-400 text-center"
        >
          Already have an account? Login
        </Link>
      </form>
    </div>
  );
}

export default Register;