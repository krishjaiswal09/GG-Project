import React, { useState, useEffect } from "react";
import { CiBellOn } from "react-icons/ci";
import { useAdmin } from "../contexts/AdminContext";

function AdminNotification() {
  const { adminTodos } = useAdmin(); 
  const [isOpen, setIsOpen] = useState(false);
  const [newNotifications, setNewNotifications] = useState(false);
  const [readTodos, setReadTodos] = useState(() => {
    const saved = localStorage.getItem('readAdminNotifications');
    return saved ? JSON.parse(saved) : [];
  });

  // For demo purposes, we'll use mock data if adminTodos is not available
  const todos = adminTodos || [
    { _id: '1', title: 'New user registered', description: 'John Doe has registered', completed: false, dueDate: '2023-06-16' },
    { _id: '2', title: 'System update', description: 'System update completed successfully', completed: true, dueDate: '2023-06-16' },
    { _id: '3', title: 'Security alert', description: 'Multiple failed login attempts detected', completed: false, dueDate: '2023-06-16' }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const getStatusBadge = (completed) =>
    completed ? (
      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Completed
      </span>
    ) : (
      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Upcoming
      </span>
    );

  useEffect(() => {
    // Check if there are any todos that haven't been read yet
    const unreadTodos = todos.filter(todo => !readTodos.includes(todo._id));
    setNewNotifications(unreadTodos.length > 0);
  }, [todos, readTodos]);

  const handleOpenNotifications = () => {
    setIsOpen(true);
    // Mark all todos as read when opening notifications
    const todoIds = todos.map(todo => todo._id);
    setReadTodos(todoIds);
    localStorage.setItem('readAdminNotifications', JSON.stringify(todoIds));
    setNewNotifications(false);
  };

  return (
    <div className="relative">
      {/* Bell Button with notification indicator */}
      <button onClick={handleOpenNotifications} className="relative">
        <CiBellOn className="w-6 h-6 cursor-pointer text-gray-700" />
        {newNotifications && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        )}
      </button>

      {/* Drawer */}
      <div
        className={`fixed inset-0 z-50 ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ease-out ${
            isOpen ? "opacity-50" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              All Notifications
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Notifications */}
          <div className="p-6 space-y-4 overflow-y-auto h-full">
            {todos.length === 0 && (
              <p className="text-gray-500 text-sm">No notifications</p>
            )}

            {todos.map((todo) => (
              <div
                key={todo._id}
                className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-base font-semibold text-gray-900">
                    {todo.title}
                  </h3>
                  {getStatusBadge(todo.completed)}
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  {todo.description || ""}
                </p>

                {todo.dueDate && (
                  <div className="text-sm text-gray-500">
                    {formatDate(todo.dueDate)}{todo.dueTime && ` ${todo.dueTime}`}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminNotification;