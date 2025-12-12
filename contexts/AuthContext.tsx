import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, name: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, name: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

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
      allowedRoles
    };

    setUser(newUser);
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
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, switchRole }}>
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