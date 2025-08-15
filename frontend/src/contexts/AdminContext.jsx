import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Create admin context
export const AdminContext = createContext({
  isAdmin: false,
  users: [],
  userPermissions: {},
  setUserPermission: () => {},
});

// Custom hook for using admin context
export const useAdmin = () => useContext(AdminContext);

// Admin email for super admin recognition
const ADMIN_EMAIL = 'adminuser@gmail.com';

export const AdminProvider = ({ children }) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [userPermissions, setUserPermissions] = useState({});

  // Check if current user is admin based on email
  useEffect(() => {
    if (user && user.email) {
      // Check if user email matches admin email
      setIsAdmin(user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  // Mock function to set user permissions
  // In a real app, this would call an API
  const setUserPermission = (userId, canEdit) => {
    setUserPermissions(prev => ({
      ...prev,
      [userId]: { canEdit }
    }));
  };

  // Mock function to load users
  // In a real app, this would call an API
  useEffect(() => {
    if (isAdmin) {
      // Mock user data since we're not updating the backend
      const mockUsers = [
        { _id: '1', name: 'Regular User 1', email: 'user1@example.com' },
        { _id: '2', name: 'Regular User 2', email: 'user2@example.com' },
        { _id: '3', name: 'Regular User 3', email: 'user3@example.com' },
      ];
      
      // Initialize permissions if not already set
      const initialPermissions = {};
      mockUsers.forEach(user => {
        if (!userPermissions[user._id]) {
          initialPermissions[user._id] = { canEdit: true }; // Default permission
        }
      });
      
      setUsers(mockUsers);
      setUserPermissions(prev => ({ ...prev, ...initialPermissions }));
    }
  }, [isAdmin]);

  // Check if a specific user has edit permissions
  const hasEditPermission = (userId) => {
    return userPermissions[userId]?.canEdit ?? true; // Default to true if not set
  };

  const value = {
    isAdmin,
    users,
    userPermissions,
    setUserPermission,
    hasEditPermission,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};