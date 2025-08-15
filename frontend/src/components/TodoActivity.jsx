import React from 'react';

export default function TodoStats({ todos = [] }) {
  
  const allTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const upcomingTodos = todos.filter(todo => !todo.completed).length;

  const stats = [
    { label: 'All Todos', value: allTodos },
    { label: 'Upcoming', value: upcomingTodos },
    { label: 'Completed', value: completedTodos }
  ];

  return (
    <div className="bg-white rounded-xl shadow p-8 flex items-center mb-6">
      {stats.map((item, index) => (
        <React.Fragment key={item.label}>
          <div className="flex flex-col text-left space-y-2 ">
            <span className="text-base font-medium text-gray-500 px-7">
              {item.label}
            </span>
            <span className="text-3xl font-semibold text-gray-900 px-7">
              {item.value}
            </span>
          </div>
          {index < stats.length - 1 && (
            <div className="w-px h-16 bg-gray-200 mx-8" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}