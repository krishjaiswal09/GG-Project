import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function Login({ onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (!success) {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left image section */}
      <div
        className="w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/img.jpg')" }}
      ></div>

      {/* Right form section */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
          <h1 className="flex justify-center text-2xl font-bold mb-2 text-gray-800">
            GREEDYGAME
          </h1>
          <h2 className="flex justify-center text-2xl font-bold mb-2 text-gray-800">
            Welcome to GGTodo
          </h2>
          <p className="flex justify-center mb-6 text-gray-600">
            To get started, please sign in
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            <div className="flex justify-between items-center mb-4">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Remember me
              </label>
            </div>
            <button
              type="submit"
              className={`w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Login"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              className="text-sm  "
              onClick={onSwitchToRegister}
              disabled={isLoading}
            >
              Need an account?
              <span className="text-green-600 hover:underline">
                {" "}Register here
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
