import React from "react";
import { useTodo } from "../contexts/TodoContext";
import { useAuth } from "../contexts/AuthContext";
import TodoForm from "./TodoForm";

function AdminDashboard() {
  const { user } = useAuth();
  const { todos, loading, error } = useTodo();
  const [filter, setFilter] = React.useState("all");

  // Filter todos based on current filter
  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return true;
    if (filter === "completed") return todo.completed;
    if (filter === "active") return !todo.completed;
    return true;
  });

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {user?.name || "Admin"}
          </h2>
          <p className="text-sm text-gray-400">
            Last Updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            All Todos
          </h3>
          <p className="text-3xl font-bold text-gray-900">{todos.length}</p>
          <div className="mt-2 text-sm text-gray-500">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Upcoming
          </h3>
          <p className="text-3xl font-bold">
            {todos.filter((todo) => !todo.completed).length}
          </p>
          <div className="mt-2 text-sm text-gray-500">
            Tasks to be completed
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Completed
          </h3>
          <p className="text-3xl font-bold">
            {todos.filter((todo) => todo.completed).length}
          </p>
          <div className="mt-2 text-sm text-gray-500">Tasks completed</div>
        </div>
      </div>

      {/* Todo Form */}
      <div className="bg-white rounded-xl  ">
        <TodoForm filter={filter} setFilter={setFilter} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-center py-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
