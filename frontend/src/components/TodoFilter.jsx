import React, { useState, useRef, useEffect } from "react";

function TodoFilter({ filter, setFilter }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
  ];

  const currentFilter = filterOptions.find((option) => option.value === filter);

  const handleFilterSelect = (filterValue) => {
    setFilter(filterValue);
    setIsOpen(false);
  };

  return (
    <div className="relative mb-6 flex justify-end" ref={dropdownRef}>
      <button
        className="bg-white rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none shadow-sm flex items-center justify-between min-w-32"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <svg
            className="w-4 h-4 mr-2 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span>Filter</span>
        </div>
        <svg
          className={`w-4 h-4 ml-2 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              className={`w-full px-3 py-1 text-sm text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                filter === option.value
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-700"
              }`}
              onClick={() => handleFilterSelect(option.value)}
            >
              {option.label}
              {filter === option.value && (
                <svg
                  className="w-3 h-3 inline-block ml-1 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default TodoFilter;
