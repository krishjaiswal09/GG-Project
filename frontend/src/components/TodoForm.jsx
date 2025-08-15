import React, { useState, useRef, useEffect } from "react";
import { useTodo } from "../contexts/TodoContext";
import TodoItem from "./TodoItem";
import TodoDetail from "./TodoDetail";

function TodoForm({ filter, setFilter }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  
  // Add these new state variables for todo detail
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { todos, addTodo, updateTodo, deleteTodo, toggleComplete, loading } =
    useTodo();
  const filterDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target)
      ) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return true;
    if (filter === "completed") return todo.completed;
    if (filter === "active") return !todo.completed;
    return true;
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDueDate("");
    setDueTime("");
    setIsModalOpen(false);
    setEditingTodo(null);
  };

  const add = async (e) => {
    e.preventDefault();
    if (!title || !description) return;

    const todoData = {
      title,
      description,
      priority,
      dueDate,
      dueTime,
      completed: false,
    };
    const success = editingTodo
      ? await updateTodo(editingTodo._id, { ...editingTodo, ...todoData })
      : await addTodo(todoData);

    if (success) resetForm();
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description);
    setPriority(todo.priority);
    setDueDate(todo.dueDate || "");
    setDueTime(todo.dueTime || "");
    setIsModalOpen(true);
  };

  const handleDelete = (id) => deleteTodo(id);
  const handleToggleComplete = (id) => toggleComplete(id);

  // Add these new handler functions for todo detail
  const handleTodoClick = (todo) => {
    setSelectedTodo(todo);
    setIsDetailOpen(true);
  };

  const handleDetailClose = () => {
    setSelectedTodo(null);
    setIsDetailOpen(false);
  };

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString() : "No due date";

  const getStatusBadge = (completed) =>
    completed ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Completed
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Upcoming
      </span>
    );

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
  ];

  const handleFilterSelect = (filterValue) => {
    setFilter(filterValue);
    setIsFilterOpen(false);
  };

  const openModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Header with Filter and Add Button */}
      <div className="bg-white rounded-lg shadow-sm mb-4">
        <div className="flex justify-between items-center p-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">All Todos</h2>
            <p className="text-sm text-gray-500">
              Last Updated: {new Date().toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Filter Dropdown */}
            <div className="relative" ref={filterDropdownRef}>
              <button
                type="button"
                className="bg-gray-50 hover:bg-gray-100 rounded-lg pw-2 px-5 py-1.5 text-sm font-medium text-gray-700 flex items-center min-w-28 transition-colors"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-green-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L14 14.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 018 17v-2.586L3.293 6.707A1 1 0 013 6V4z"
                  />
                </svg>
                <span>Filter</span>
                <span className={`${isFilterOpen ? "rotate-180" : ""}`}></span>
              </button>
              {isFilterOpen && (
                <div className="absolute top-full mt-2 right-0 w-36 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                        filter === option.value
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-700"
                      }`}
                      onClick={() => handleFilterSelect(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Add Todo */}
            <button
              type="button"
              onClick={openModal}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              + Add Todo
            </button>
          </div>
        </div>

        {/* Todos Table */}
        <div className="overflow-x-auto px-4 md:px-6">
          {/* horizontal padding */}
          <table className="min-w-full bg-white rounded-lg ">
            <thead className="bg-gray-50 rounded-lg ">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Todo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center">
                    Loading tasks...
                  </td>
                </tr>
              ) : filteredTodos.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No tasks to show
                  </td>
                </tr>
              ) : (
                filteredTodos.map((todo) => (
                  <TodoItem
                    key={todo._id}
                    todo={todo}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    handleToggleComplete={handleToggleComplete}
                    formatDate={formatDate}
                    getStatusBadge={getStatusBadge}
                    onTodoClick={handleTodoClick} // Add this prop
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Section */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isModalOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Dimmed Background */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={resetForm}
        />

        {/* Sliding Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            isModalOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-full flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingTodo ? "Edit Todo" : "Add Todo"}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Title"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Enter Description"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Time
                </label>
                <input
                  type="time"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={add}
                  disabled={loading || !title || !description}
                  className={`px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium ${
                    loading || !title || !description
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {editingTodo ? "Update Todo" : "Create Todo"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add TodoDetail Component */}
      <TodoDetail
        todo={selectedTodo}
        isOpen={isDetailOpen}
        onClose={handleDetailClose}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </>
  );
}

export default TodoForm;