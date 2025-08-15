import React, { useState } from "react";
import { useAdmin } from "../contexts/AdminContext";
import { useAuth } from "../contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { MdDashboard, MdPeople, MdLogout } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import AdminProfile from "./AdminProfile";
import AdminNotification from "./AdminNotification";
import { CiSearch } from "react-icons/ci";

function AdminLayout({ children }) {
  const { isAdmin } = useAdmin();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownOpen && !event.target.closest(".profile-dropdown")) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileDropdownOpen]);

  if (!isAdmin) return children;

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gray-700 text-white flex flex-col p-6 space-y-6">
        {/* Logo */}
        <div>
          <h1 className="text-2xl font-bold">GREEDYGAME</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin"
                className={`flex items-center px-4 py-2 rounded-lg ${
                  isActive("/admin")
                    ? "bg-green-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <MdDashboard className="mr-3 text-xl" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/admin/users"
                className={`flex items-center px-4 py-2 rounded-lg ${
                  isActive("/admin/users")
                    ? "bg-green-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <MdPeople className="mr-3 text-xl" />
                Users
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-6 py-4 flex justify-between items-center">
            {/* Search Input */}
            <div className="relative w-64">
              <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5" />
              <input
                type="text"
                placeholder="Search todos..."
                className="pl-10 pr-4 py-2 rounded-lg bg-gray-100 w-full focus:outline-none focus:ring-0 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Right side - Admin Actions */}
            <div className="flex items-center space-x-3">
              <AdminNotification />

              {/* Admin Profile */}
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-1 focus:outline-none"
                >
                  <img
                    src={user.photoURL || "/assets/img2.jpg"}
                    alt="Admin"
                    className="w-10 h-10 rounded-full object-cover border-2 border-green-500"
                  />
                  <RiArrowDropDownLine className="w-5 h-5 text-gray-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-xl overflow-hidden z-50">
                    <button
                      onClick={() => {
                        setProfileOpen(true);
                        setProfileDropdownOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 font-medium hover:bg-gray-50"
                    >
                      <CgProfile className="w-5 h-5 text-gray-400" />
                      Profile
                    </button>

                    <div className="border-t border-gray-200 mx-3" />

                    <button
                      onClick={logout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 font-medium hover:bg-gray-50"
                    >
                      <MdLogout className="w-5 h-5 text-gray-400" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>

        {/* Admin Profile Slide-in Panel */}
        <AdminProfile
          isOpen={profileOpen}
          onClose={() => setProfileOpen(false)}
        />
      </div>
    </div>
  );
}

export default AdminLayout;
