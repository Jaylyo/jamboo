import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  allUsers: User[];
  login: (email: string, name: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  addUser: (user: Omit<User, 'id' | 'allowedRoles'>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial Mock Data for the application
const INITIAL_USERS: User[] = [
  { id: '1', name: 'Maria Santos', email: 'm.santos@email.com', role: 'RESPONDER', allowedRoles: ['RESPONDER'], status: 'Active' },
  { id: '2', name: 'John Doe', email: 'tourist1@email.com', role: 'TOURIST', allowedRoles: ['TOURIST'], status: 'Active' },
  { id: '3', name: 'Staff User', email: 'staff@cebusafe.com', role: 'STAFF', allowedRoles: ['STAFF'], status: 'Active' },
  { id: '4', name: 'Jane Smith', email: 'jane.s@email.com', role: 'TOURIST', allowedRoles: ['TOURIST'], status: 'Suspended' },
  { id: '5', name: 'Admin User', email: 'admin@cebu.gov', role: 'ADMIN', allowedRoles: ['ADMIN', 'STAFF', 'RESPONDER', 'TOURIST'], status: 'Active' },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);

  const login = async (email: string, name: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check if user already exists
    const existingUser = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      setUser(existingUser);
      return;
    }

    // Determine role for new user based on email pattern (for demo self-registration)
    let role: UserRole = 'TOURIST';
    let allowedRoles: UserRole[] = ['TOURIST'];

    if (email.toLowerCase().includes('admin@cebu.gov')) {
      role = 'ADMIN';
      allowedRoles = ['ADMIN', 'STAFF', 'RESPONDER', 'TOURIST'];
    } else if (email.toLowerCase().includes('rescue@cebu.gov')) {
      role = 'RESPONDER';
      allowedRoles = ['RESPONDER', 'TOURIST'];
    } else if (email.toLowerCase().includes('staff@cebu.gov')) {
      role = 'STAFF';
      allowedRoles = ['STAFF', 'TOURIST'];
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: name || 'User',
      email,
      role,
      allowedRoles,
      status: 'Active'
    };

    // Add new user to the global list and set as current user
    setAllUsers(prev => [...prev, newUser]);
    setUser(newUser);
  };

  const addUser = (userData: Omit<User, 'id' | 'allowedRoles'>) => {
    // Determine allowed roles based on the primary role assigned by Admin
    let allowedRoles: UserRole[] = [userData.role];
    
    // Add TOURIST as a base role for everyone
    if (!allowedRoles.includes('TOURIST')) {
        allowedRoles.push('TOURIST');
    }

    // Add additional roles based on hierarchy for demo flexibility
    if (userData.role === 'ADMIN') {
        allowedRoles = ['ADMIN', 'STAFF', 'RESPONDER', 'TOURIST'];
    }

    const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        allowedRoles,
        status: userData.status || 'Active'
    };

    setAllUsers(prev => [...prev, newUser]);
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (user && user.allowedRoles.includes(newRole)) {
      setUser({ ...user, role: newRole });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, allUsers, login, logout, switchRole, addUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};