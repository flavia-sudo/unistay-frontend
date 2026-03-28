import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { login } from "../features/login/authSlice";
import type { AppDispatch } from "../app/store";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    // Basic validation
    if (!email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
      setErrorMessage("Invalid email address!");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password should be at least 6 characters long");
      return;
    }

    try {
      const response = await axios.post(
        "https://hostel-backend-fyy3.onrender.com/auth/login",
        { email, password }
      );

      const user = response.data.user;
      const token = response.data.token;

      if (!user || !token) {
        setErrorMessage("Invalid response from server");
        return;
      }

      const userData = { ...user, token };

      // Save Redux state
      dispatch(login(userData));

      // Persist login
      localStorage.setItem("User", JSON.stringify(userData));

      const role = user.role?.toLowerCase();
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "landlord") {
        navigate("/landlord");
      } else {
        navigate("/dashboard");
      }

      // Clear form & navigate
      setEmail("");
      setPassword("");
      navigate("/");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ||
            error.response?.data?.error ||
            "Login failed"
        );
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md space-y-6">
        <h2 className="text-3xl font-extrabold text-center text-gray-900">
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-black"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-black"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-800" /> : <Eye className="h-5 w-5 text-gray-800" />}
              </button>
            </div>
          </div>

          {errorMessage && <div className="text-red-600 text-sm text-center">{errorMessage}</div>}

          <button
            type="submit"
            className="w-full py-2 text-white bg-purple-800 rounded-md hover:bg-purple-700 font-semibold shadow-lg transition-colors"
          >
            Sign In
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <button onClick={() => navigate("/register")} className="text-purple-600 underline">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;