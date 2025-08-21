import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useAdmin } from "../contexts/AdminContext";
import { Link } from "react-router-dom";
import { RiArrowDropDownLine } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import { IoLogOutOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { MdAdminPanelSettings } from "react-icons/md";
import TodoProfile from "./TodoProfile";
import TodoNotification from "./TodoNotification";

function Header({ searchQuery, setSearchQuery }) {
  const { user, logout } = useAuth();
  const { isAdmin } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <header className="bg-white bg-opacity-30 py-4 border-b border-gray-200">
        <div className="w-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <h1 className="text-2xl font-bold text-black">GREEDYGAME</h1>

            {/* Search Input */}
            <div className="relative">
              <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5" />
              <input
                type="text"
                placeholder="Search todos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg bg-gray-100 w-full focus:outline-none focus:ring-0 focus:border-transparent"
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
          </div>

          {user && (
            <div className="relative flex items-center gap-4">
              <TodoNotification />

              <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex items-center gap-1 text-black font-medium focus:outline-none"
                aria-expanded={isOpen}
              >
                <div className="relative">
                  <img
                    src={user.photoURL || "/assets/img2.jpg"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                  {isAdmin && (
                    <div
                      className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full p-0.5"
                      title="Admin"
                    >
                      <MdAdminPanelSettings className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <RiArrowDropDownLine className="w-5 h-5" />
              </button>

              {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-50">
                  <button
                    className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 font-bold hover:bg-gray-50 hover:text-gray-600"
                    onClick={() => {
                      setIsProfileOpen(true);
                      setIsOpen(false);
                    }}
                  >
                    <CgProfile className="w-5 h-5 text-gray-400" />
                    Profile
                  </button>

                  {isAdmin && (
                    <>
                      <div className="border-t border-gray-200 mx-3" />
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 font-bold hover:bg-gray-50 hover:text-gray-600"
                        onClick={() => setIsOpen(false)}
                      >
                        <MdAdminPanelSettings className="w-5 h-5 text-gray-400" />
                        Admin Panel
                      </Link>
                    </>
                  )}

                  <div className="border-t border-gray-200 mx-3" />

                  <button
                    onClick={logout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 font-bold hover:bg-gray-50 hover:text-gray-600"
                  >
                    <IoLogOutOutline className="w-5 h-5 text-gray-400" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Profile Sidebar */}
      <TodoProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
}

export default Header;
