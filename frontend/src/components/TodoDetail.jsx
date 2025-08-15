import React from "react";
import { useAdmin } from "../contexts/AdminContext";
import { useAuth } from "../contexts/AuthContext";

function TodoDetail({ todo, isOpen, isModalOpen, onClose, handleEdit, handleDelete }) {
  const { user } = useAuth();
  const { isAdmin, hasEditPermission } = useAdmin();

  const canEdit = isAdmin || hasEditPermission(user?._id);
  const open = (typeof isOpen === "boolean" ? isOpen : isModalOpen) ?? false;

  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString("en-GB") : "";

  const StatusBadge = ({ completed }) => (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ml-2 ${
        completed ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
      }`}
    >
      {completed ? "Completed" : "Upcoming"}
    </span>
  );

  const ActionButton = ({ onClick, disabled, title, children }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`text-gray-400 hover:text-gray-600 transition-colors ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );

  return (
    <div className={`fixed inset-0 z-50 ${open ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!open}>
      {/* Dimmed Background */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${open ? "opacity-50" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Sliding Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-xl transform-gpu
          transition-transform duration-300 ease-in-out overflow-hidden ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-800">Todo Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1" aria-label="Close">
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">{todo?.title ?? ""}</h3>

            {/* Due Date */}
            {todo?.dueDate && (
              <div className="flex flex-col space-y-1 text-sm text-gray-600">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path d="M8 7V3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 7V3" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x={3} y={5} width={18} height={18} rx={2} ry={2} />
                    <path d="M3 11h18" />
                  </svg>
                  Due Date
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {formatDate(todo.dueDate)} {todo?.dueTime ?? ""}
                </div>
              </div>
            )}

            {/* Status */}
            <div className="flex items-center text-sm text-gray-600">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v18M5 3h14l-4 6 4 6H5" />
                </svg>
                Status
              </div>
              <StatusBadge completed={todo?.completed} />
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4 py-2">
              <ActionButton
                onClick={() => { if (todo) handleEdit(todo); onClose(); }}
                disabled={todo?.completed || !canEdit}
                title={!canEdit ? "No permission to edit" : todo?.completed ? "Already completed" : "Edit"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </ActionButton>

              <ActionButton
                onClick={() => { if (todo?._id) handleDelete(todo._id); onClose(); }}
                disabled={!canEdit}
                title={!canEdit ? "No permission to delete" : "Delete"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </ActionButton>
            </div>

            {/* Description */}
            {todo?.description && (
              <div className="space-y-3">
                <h4 className="text-base font-medium text-gray-900">Description</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{todo.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoDetail;
