import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../features/login/authSlice";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [code, setCode] = useState("");
  const [showVerificationForm, setShowVerificationForm] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
      setErrorMessage("Invalid email address!");
      return;
    }

    if (!phoneNumber.match(/^07\d{8}$/)) {
      setErrorMessage("Invalid phone number!");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password should be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    const userDetails = {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
    };

    try {
      const response = await axios.post(
        "https://hostel-backend-fyy3.onrender.com/auth/register",
        userDetails,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status !== 201) {
        navigate("/verify");
      } else {
        setErrorMessage(response.data.message || "Registration failed.");
      }
      console.log("Registration successful:", response.data);
      const user = response.data.user;
      const token = response.data.token;

      dispatch(login({ ...user, token }));

      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setPhoneNumber("");

      setShowVerificationForm(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Registration error:", error.response?.data);
        setErrorMessage(error.response?.data?.message || "Registration failed. Please try again.");
      } else {
        console.error("Unexpected error:", error);
        setErrorMessage("An unexpected error occurred");
      }
    }
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    const user = localStorage.getItem("User");
    const email = user ? JSON.parse(user).email : "";
    console.log(email);

    try {
      const response = await axios.post(
        "https://hostel-backend-fyy3.onrender.com/auth/verify",
        { email, code }
      );
      console.log(response.data);

      if (response.status === 200) {
        navigate("/");
      } else {
        setErrorMessage(response.data.message || "Verification failed");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Verification error:", error.response?.data);
        setErrorMessage(error.response?.data?.error || "Verification failed");
      } else {
        console.error("Unexpected error:", error);
        setErrorMessage("An unexpected error occurred");
      }
    }
  };

  const inputStyle =
    "w-full px-4 py-3 mt-1 text-gray-800 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200";

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-16 bg-gradient-to-br from-purple-50 to-gray-100">
      <div className="w-full max-w-xl p-10 space-y-8 bg-white shadow-2xl rounded-2xl">
        {!showVerificationForm ? (
          <>
            <div>
              <h2 className="text-4xl font-bold text-center text-gray-800">
                Sign Up
              </h2>
              <p className="mt-2 text-sm text-center text-gray-500">
                Create your account to get started
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) =>
                      setFirstName(
                        e.target.value.charAt(0).toUpperCase() +
                          e.target.value.slice(1)
                      )
                    }
                    required
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) =>
                      setLastName(
                        e.target.value.charAt(0).toUpperCase() +
                          e.target.value.slice(1)
                      )
                    }
                    required
                    className={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputStyle}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`${inputStyle} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`${inputStyle} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPassword}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="text-sm text-center text-red-600">
                  {errorMessage}
                </div>
              )}

              <div className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="font-medium text-purple-700 transition hover:text-purple-900"
                >
                  Login
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 font-semibold text-white transition-all duration-300 bg-gradient-to-r from-purple-700 to-purple-900 rounded-lg shadow-lg hover:scale-[1.02] hover:shadow-xl"
              >
                Sign Up
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-center text-gray-800">
              Enter Verification Code
            </h2>

            <form className="mt-6 space-y-5" onSubmit={handleVerify}>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter your verification code..."
                required
                className={inputStyle}
              />

              {errorMessage && (
                <div className="text-sm text-center text-red-600">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 font-semibold text-white transition-all duration-300 bg-gradient-to-r from-purple-700 to-purple-900 rounded-lg shadow-lg hover:scale-[1.02] hover:shadow-xl"
              >
                Verify Account
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;