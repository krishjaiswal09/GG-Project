import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { TodoProvider, useTodo } from "./contexts/TodoContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AdminProvider, useAdmin } from "./contexts/AdminContext";
import TodoForm from "./components/TodoForm";
import Login from "./components/Login";
import Register from "./components/Register";
import Header from "./components/Header";
import TodoActivity from "./components/TodoActivity";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./components/AdminDashboard";
import AdminUsers from "./components/AdminUsers";

function TodoApp() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const { todos, loading, error } = useTodo();
  const { isAdmin } = useAdmin();

  const filteredTodos = todos.filter((todo) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "completed"
        ? todo.completed
        : !todo.completed;

    const matchesSearch =
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="w-full px-4 py-6">
        <h1 className="text-3xl font-bold mb-8 text-black">
          Hello, {user.name}
        </h1>

        <div className="mx-2">
          <TodoActivity todos={todos} filteredTodos={filteredTodos} />
        </div>

        <div className="mb-6 mx-2">
          <TodoForm
            filter={filter}
            setFilter={setFilter}
            searchQuery={searchQuery}
          />
        </div>

        {error && (
          <div className="text-center py-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mx-2">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminRoutes() {
  const { isAdmin } = useAdmin();
  if (!isAdmin) return <Navigate to="/" />;

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/users" element={<AdminUsers />} />
      </Routes>
    </AdminLayout>
  );
}

function App() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <Router>
      <AuthProvider>
        <AdminProvider>
          <TodoProvider>
            <AppContent
              showRegister={showRegister}
              setShowRegister={setShowRegister}
            />
          </TodoProvider>
        </AdminProvider>
      </AuthProvider>
    </Router>
  );
}

function AppContent({ showRegister, setShowRegister }) {
  const { isAuthenticated, loading } = useAuth();
  const { isAdmin } = useAdmin();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black-900 flex items-center justify-center">
        <div className="inline-flex items-center px-4 py-2 text-white">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5"
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
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  return (
    <Routes>
      {isAdmin ? (
        <>
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="*" element={<Navigate to="/admin" />} />
        </>
      ) : (
        <>
          <Route path="/" element={<TodoApp />} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}
    </Routes>
  );
}

export default App;
