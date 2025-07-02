import React, { useState } from "react";
import { authAPI } from "../services/api";
import { Lock, User } from "lucide-react";

const Login = ({ onLoginSuccess, isDarkMode }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
    try {
      const response = await authAPI.login(username, password);
      if (response && !response.error) {
        localStorage.setItem("userRole", response.role || "");
        onLoginSuccess(response.name, response.role);
        window.location.reload(); // Force full reload after login
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-950 to-gray-800"
          : "bg-gradient-to-br from-blue-100 via-white to-blue-200"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-md p-10 rounded-2xl shadow-2xl border transition-all duration-300 ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
        style={{ minWidth: 350 }}
      >
        <div className="flex flex-col items-center mb-8">
          <div
            className={`rounded-full p-3 mb-2 shadow ${
              isDarkMode ? "bg-gray-900" : "bg-blue-100"
            }`}
          >
            <Lock
              size={32}
              className={isDarkMode ? "text-blue-400" : "text-blue-600"}
            />
          </div>
          <h2
            className={`text-3xl font-extrabold text-center tracking-tight ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Sign in
          </h2>
        </div>
        <div className="mb-5">
          <label
            className={`block mb-2 text-sm font-semibold ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Username
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <User size={18} />
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none text-base transition-colors duration-200 ${
                isDarkMode
                  ? "bg-gray-900 border-gray-700 text-white placeholder-gray-500"
                  : "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400"
              }`}
              placeholder="Enter your username"
              required
              autoFocus
            />
          </div>
        </div>
        <div className="mb-7">
          <label
            className={`block mb-2 text-sm font-semibold ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Password
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock size={18} />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full pl-10 pr-10 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none text-base transition-colors duration-200 ${
                isDarkMode
                  ? "bg-gray-900 border-gray-700 text-white placeholder-gray-500"
                  : "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400"
              }`}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 focus:outline-none"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12.001C3.226 16.273 7.355 19.5 12 19.5c1.658 0 3.237-.335 4.646-.94M21.165 8.26A10.45 10.45 0 0122.066 12c-1.292 4.272-5.421 7.5-10.066 7.5a10.45 10.45 0 01-4.646-.94M15 12a3 3 0 11-6 0 3 3 0 016 0zm6-6l-6 6m0 0l-6 6"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12zm9.75 3.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        {error && (
          <div className="mb-4 text-red-500 text-center font-semibold">
            {error}
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transition-colors duration-200 text-lg tracking-wide focus:ring-2 focus:ring-blue-400 focus:outline-none"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Logging in...
            </span>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
