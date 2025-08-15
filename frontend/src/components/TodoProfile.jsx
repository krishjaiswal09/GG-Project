import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTodo } from "../contexts/TodoContext";

function TodoProfile({ isOpen, onClose }) {
  const { user, logout, updateProfile } = useAuth();
  const { todos } = useTodo();
  const open = isOpen ?? false;
  const fileInputRef = useRef(null);

  // Local state for editable fields
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "/assets/img2.jpg");

  // Sync local state with context when user changes
  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setPhotoURL(user?.photoURL || "/assets/img2.jpg");
  }, [user]);

  // Handle photo change
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const newPhotoURL = reader.result;
      setPhotoURL(newPhotoURL); // Update local preview
    };
    reader.readAsDataURL(file);
  };

  // Handle update button click
  const handleUpdate = () => {
    updateProfile({ name, email, photoURL }); // ✅ update context & localStorage
    onClose(); // ✅ Auto close after update
  };

  // Compute todo stats
  const allTodos = todos.length;
  const completedTodos = todos.filter((t) => t.completed).length;
  const upcomingTodos = todos.filter((t) => !t.completed).length;

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      {/* Dimmed Background */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ease-out ${
          open ? "opacity-50" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sliding Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-xl transform-gpu
          transition-transform duration-300 ease-in-out overflow-hidden
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-800">Profile</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            {/* Avatar + Role + Join Date */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={photoURL}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border border-gray-200"
                />
                <div
                  className="absolute bottom-0 right-0 bg-white p-1 rounded-full cursor-pointer border border-gray-200 hover:bg-gray-100"
                  onClick={() => fileInputRef.current.click()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z"
                    />
                  </svg>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                />
                {user?.role && (
                  <span className="absolute -bottom-1 -right-6 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
                    {user.role}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{user?.name || "No Name"}</h3>
                {user?.joinedOn && (
                  <p className="text-gray-400 text-sm">
                    Joined On: {new Date(user.joinedOn).toLocaleDateString("en-GB")}
                  </p>
                )}
              </div>
            </div>

            {/* Editable Fields */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-gray-600 text-sm mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-md p-2 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-md p-2 text-gray-900"
                />
              </div>
              {/* Update Profile Button */}
              <button
                onClick={handleUpdate}
                className="bg-green-100 text-green-700 font-semibold py-2 rounded-md hover:bg-green-200 transition"
              >
                Update Profile
              </button>
            </div>

            {/* Todo Stats */}
            <div className="flex justify-between bg-gray-50 p-4 rounded-md text-center">
              <div>
                <p className="text-sm text-gray-500">All Todos</p>
                <p className="text-lg font-bold text-gray-900">{allTodos}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Upcoming</p>
                <p className="text-lg font-bold text-gray-900">{upcomingTodos}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-lg font-bold text-gray-900">{completedTodos}</p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium mt-auto"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoProfile;
