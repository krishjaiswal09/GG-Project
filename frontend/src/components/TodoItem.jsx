import React from "react";

function TodoItem({
  todo,
  handleEdit,
  handleDelete,
  handleToggleComplete,
  formatDate,
  getStatusBadge,
  onTodoClick,
}) {
  const handleRowClick = () => {
    onTodoClick(todo);
  };

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
            <div className={`text-sm font-medium ${todo.completed}`}>
              {todo.title}
            </div>
            <div className={`text-sm text-gray-500 ${todo.completed}`}>
              {todo.description}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{formatDate(todo.dueDate)}</div>
        {todo.dueTime && (
          <div className="text-sm text-gray-500">{todo.dueTime}</div>
        )}
      </td>
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
            disabled={todo.completed}
            className="text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="text-red-600 hover:text-red-900"
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}

export default TodoItem;
