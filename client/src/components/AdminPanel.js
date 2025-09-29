import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [todos, setTodos] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  
  const { logout } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersResponse, todosResponse] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getAllTodos()
      ]);
      setUsers(usersResponse.data);
      setTodos(todosResponse.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminAPI.updateUserRole(userId, newRole);
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600">Manage users and todos</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Back to Dashboard
            </Link>
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
        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'users' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('todos')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'todos' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Todos ({todos.length})
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{user.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Todos Tab */}
        {activeTab === 'todos' && (
          <div className="grid gap-4">
            {todos.map(todo => (
              <div key={todo._id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
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
                      {todo.completed && (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      )}
                    </div>
                    
                    {todo.description && (
                      <p className="text-gray-700 mb-2">{todo.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Created by: {todo.user?.username}</span>
                      <span>Due: {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'No due date'}</span>
                      <span>Created: {new Date(todo.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;