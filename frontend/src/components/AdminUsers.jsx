import React from "react";
import { useAdmin } from "../contexts/AdminContext";

function AdminUsers() {
  const { users, userPermissions, setUserPermission } = useAdmin();

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">All Users</h2>
          <p className="text-sm text-gray-400">
            Last Updated: {new Date().toLocaleString()}
          </p>
        </div>
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center text-sm font-medium">
          + Add Users
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">
                Role
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                {/* Name */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src="/assets/img2.jpg"
                        alt="profile"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-400">{user.email}</div>
                    </div>
                  </div>
                </td>

                {/* Role */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-sm font-medium rounded-md bg-gray-100 text-gray-700">
                    {user.role || "Viewer"}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={userPermissions[user._id]?.canEdit ?? false}
                      onChange={(e) =>
                        setUserPermission(user._id, e.target.checked)
                      }
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-green-500 transition-colors duration-300"></div>
                    <div
                      className={`absolute left-0 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                        userPermissions[user._id]?.canEdit
                          ? "translate-x-5"
                          : ""
                      }`}
                    ></div>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsers;
