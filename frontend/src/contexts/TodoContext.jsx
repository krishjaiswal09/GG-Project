import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { tasksAPI } from '../services/api';
import { useAuth } from './AuthContext';

export const TodoContext = createContext({
  todos: [],
  loading: false,
  error: null,
  addTodo: () => Promise.resolve(false),
  updateTodo: () => Promise.resolve(false),
  deleteTodo: () => Promise.resolve(false),
  toggleComplete: () => Promise.resolve(false),
  refreshTodos: () => Promise.resolve(),
});

export const useTodo = () => {
  return useContext(TodoContext);
};

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Fetch todos from API
  const fetchTodos = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const { data } = await tasksAPI.getTasks();
      setTodos(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError(err.response?.data?.message || 'Failed to fetch tasks. Please try again.');
      setTodos([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch todos when component mounts or auth state changes
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Add new todo
  const addTodo = async (todo) => {
    try {
      setLoading(true);
      const { data } = await tasksAPI.createTask(todo);
      setTodos((prev) => [data, ...prev]);
      
      // Get current read todos from localStorage
      const readTodosStr = localStorage.getItem('readTodos');
      const readTodos = readTodosStr ? JSON.parse(readTodosStr) : [];
      
      // Don't add the new todo to read todos so it will show as a notification
      localStorage.setItem('readTodos', JSON.stringify(readTodos));
      
      setError(null);
      return true;
    } catch (err) {
      console.error('Failed to add task:', err);
      setError(err.response?.data?.message || 'Failed to add task. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update todo
  const updateTodo = async (id, todo) => {
    try {
      setLoading(true);
      const { data } = await tasksAPI.updateTask(id, todo);
      setTodos((prev) =>
        prev.map((prevTodo) => (prevTodo._id === id ? data : prevTodo))
      );
      setError(null);
      return true;
    } catch (err) {
      console.error('Failed to update task:', err);
      setError(err.response?.data?.message || 'Failed to update task. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      setLoading(true);
      await tasksAPI.deleteTask(id);
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
      setError(null);
      return true;
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError(err.response?.data?.message || 'Failed to delete task. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Toggle complete status
  const toggleComplete = async (id) => {
    try {
      const todo = todos.find((t) => t._id === id);
      if (!todo) return false;
      
      return await updateTodo(id, { ...todo, completed: !todo.completed });
    } catch (err) {
      console.error('Failed to update task status:', err);
      setError(err.response?.data?.message || 'Failed to update task status. Please try again.');
      return false;
    }
  };

  const contextValue = {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    refreshTodos: fetchTodos,
  };

  return (
    <TodoContext.Provider value={contextValue}>
      {children}
    </TodoContext.Provider>
  );
};