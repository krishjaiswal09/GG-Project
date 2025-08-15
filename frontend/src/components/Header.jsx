import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { RiArrowDropDownLine } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import { IoLogOutOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import TodoProfile from "./TodoProfile";
import TodoNotification from "./TodoNotification";

function Header() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <header className="bg-white bg-opacity-30 py-4 border-b border-gray-200">
        <div className="w-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <h1 className="text-2xl font-bold text-black">GREEDYGAME</h1>

            <div className="relative">
              <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5" />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 rounded-lg bg-gray-100"
              />
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
                {/* ✅ Always use user.photoURL from context */}
                <img
                  src={user.photoURL || "/assets/img2.jpg"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
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

      {/* ✅ TodoProfile panel */}
      <TodoProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
}

export default Header;
