import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { todoAPI } from '../services/api';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await todoAPI.getTodos();
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async (todoData) => {
    try {
      const response = await todoAPI.createTodo(todoData);
      setTodos([response.data, ...todos]);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleUpdateTodo = async (id, todoData) => {
    try {
      const response = await todoAPI.updateTodo(id, todoData);
      setTodos(todos.map(todo => todo._id === id ? response.data : todo));
      setEditingTodo(null);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await todoAPI.deleteTodo(id);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'pending') return !todo.completed;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Todos</h1>
            <p className="text-gray-600">Welcome back, {user?.username || 'User'}!</p>
          </div>
          <div className="flex items-center gap-4">
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Admin Panel
              </Link>
            )}
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border'
              }`}
            >
              All ({todos.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded ${
                filter === 'pending' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border'
              }`}
            >
              Pending ({todos.filter(t => !t.completed).length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded ${
                filter === 'completed' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border'
              }`}
            >
              Completed ({todos.filter(t => t.completed).length})
            </button>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add Todo
          </button>
        </div>

        {/* Todo Form */}
        {(showForm || editingTodo) && (
          <div className="mb-6">
            <TodoForm
              todo={editingTodo}
              onSubmit={editingTodo ? 
                (data) => handleUpdateTodo(editingTodo._id, data) : 
                handleCreateTodo
              }
              onCancel={() => {
                setShowForm(false);
                setEditingTodo(null);
              }}
            />
          </div>
        )}

        {/* Todo List */}
        <TodoList
          todos={filteredTodos}
          onEdit={setEditingTodo}
          onDelete={handleDeleteTodo}
          onToggle={(id, completed) => handleUpdateTodo(id, { completed })}
          userRole={user?.role}
        />
      </div>
    </div>
  );
};

export default Dashboard;