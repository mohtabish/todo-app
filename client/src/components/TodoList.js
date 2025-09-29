import React from 'react';

const TodoList = ({ todos, onEdit, onDelete, onToggle, userRole }) => {
  if (todos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">No todos found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {todos.map(todo => (
        <TodoCard
          key={todo._id}
          todo={todo}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
          userRole={userRole}
        />
      ))}
    </div>
  );
};

const TodoCard = ({ todo, onEdit, onDelete, onToggle, userRole }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md border-l-4 ${
      todo.completed 
        ? 'border-green-500 opacity-75' 
        : todo.category === 'Urgent' 
          ? 'border-red-500' 
          : 'border-blue-500'
    }`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggle(todo._id, !todo.completed)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <h3 className={`font-semibold ${todo.completed ? 'line-through text-gray-500' : ''}`}>
              {todo.title}
            </h3>
            <span className={`px-2 py-1 text-xs rounded-full ${
              todo.category === 'Urgent' 
                ? 'bg-red-100 text-red-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {todo.category}
            </span>
            {isOverdue && (
              <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
                Overdue
              </span>
            )}
          </div>

          {todo.description && (
            <p className={`text-gray-700 mb-2 ${todo.completed ? 'line-through' : ''}`}>
              {todo.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Due: {formatDate(todo.dueDate)}</span>
            {userRole === 'admin' && todo.user && (
              <span>Created by: {todo.user.username}</span>
            )}
            <span>Created: {new Date(todo.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(todo)}
            className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
          >
            Edit
          </button>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this todo?')) {
                onDelete(todo._id);
              }
            }}
            className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoList;