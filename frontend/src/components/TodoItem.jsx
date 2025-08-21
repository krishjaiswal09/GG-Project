import React from "react";
import { useAdmin } from "../contexts/AdminContext";
import { useAuth } from "../contexts/AuthContext";

function TodoItem({
  todo,
  handleEdit,
  handleDelete,
  handleToggleComplete,
  formatDate,
  getStatusBadge,
  onTodoClick,
}) {
  const { user } = useAuth();
  const { isAdmin, hasEditPermission } = useAdmin();

  const canEdit = isAdmin || hasEditPermission(user?._id);

  const handleRowClick = () => onTodoClick(todo);

  const formatDateTime = () => {
    if (!todo.dueDate)
      return <div className="text-sm text-gray-400">No due date</div>;

    const date = new Date(todo.dueDate);
    if (isNaN(date.getTime()))
      return <div className="text-sm text-gray-400">Invalid date</div>;

    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    if (!todo.dueTime)
      return (
        <div className="text-sm font-medium text-gray-900">{formattedDate}</div>
      );

    const [hours, minutes] = todo.dueTime.split(":").map(Number);
    const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const amPm = hours >= 12 ? "PM" : "AM";
    const formattedTime = `${hour12}:${minutes
      .toString()
      .padStart(2, "0")} ${amPm}`;

    return (
      <div className="text-sm">
        <div className="font-medium text-gray-900">{formattedDate}</div>
        <div className="text-gray-500">{formattedTime}</div>
      </div>
    );
  };

  const todoTitleClass = `text-sm font-medium ${todo.completed}`;
  const todoDescClass = `text-sm text-gray-500 ${todo.completed}`;

  return (
    <tr className="hover:bg-gray-50 cursor-pointer" onClick={handleRowClick}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <input
            type="checkbox"
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer mr-3"
            checked={todo.completed}
            onChange={() => handleToggleComplete(todo._id)}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex-1">
            <div className={todoTitleClass}>{todo.title}</div>
            <div className={todoDescClass}>{todo.description}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">{formatDateTime()}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge(todo.completed)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(todo);
            }}
            disabled={todo.completed || !canEdit}
            className="text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
            title={
              !canEdit
                ? "You don't have permission to edit"
                : todo.completed
                ? "Completed tasks cannot be edited"
                : "Edit task"
            }
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(todo._id);
            }}
            disabled={!canEdit}
            className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
            title={
              !canEdit ? "You don't have permission to delete" : "Delete task"
            }
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0016.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}

export default TodoItem;
