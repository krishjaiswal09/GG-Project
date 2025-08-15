import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function Register({ onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const success = await register(name, email, password);
      if (!success) {
        setError("Email already registered");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
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
        <div className="max-w-md w-full p-8">
          <h2 className="flex justify-center text-2xl font-bold mb-2 text-gray-800">
            GREDDYGAME
          </h2>
          <p className="text-center text-2xl font-bold mb-2 text-gray-800">
            You're one click away from less busywork
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="font-sans">
              Full Name <span className="text-red-500">*</span>
            </div>

            <input
              type="text"
              placeholder="John Doe"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              required
            />

            <div className="font-sans">
              Email <span className="text-red-500">*</span>
            </div>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />

            <div className="font-sans">
              Password <span className="text-red-500">*</span>
            </div>
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />

            <div className="font-sans">
              Confirm Password <span className="text-red-500">*</span>
            </div>
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              required
            />

            <button
              type="submit"
              className={`w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>

            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <button
                type="button"
                className="text-green-600 hover:underline"
                onClick={onSwitchToLogin}
                disabled={isLoading}
              >
                Login
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
