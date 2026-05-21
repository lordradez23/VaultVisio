'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Role = 'ADMIN' | 'USER';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  balance: number;
}

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (email: string, password: string) => boolean;
  register: (fullName: string, email: string, password: string) => boolean;
  logout: () => void;
  sendMoney: (toEmail: string, amount: number) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'Admin@gmail.com';
const ADMIN_PASSWORD = 'Admin123';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // Initialize with admin and any stored users
  useEffect(() => {
    const savedUsers = localStorage.getItem('vault_users');
    const initialUsers: User[] = savedUsers ? JSON.parse(savedUsers) : [];
    
    // Always ensure admin exists in the users list for management
    const adminExists = initialUsers.find(u => u.email === ADMIN_EMAIL);
    const finalUsers = adminExists ? initialUsers : [
      { id: 'admin-0', fullName: 'System Administrator', email: ADMIN_EMAIL, role: 'ADMIN', balance: 1000000 },
      ...initialUsers
    ];
    
    setUsers(finalUsers);
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('vault_users', JSON.stringify(users.filter(u => u.role !== 'ADMIN')));
    }
  }, [users]);

  const login = (email: string, password: string) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const admin = users.find(u => u.email === ADMIN_EMAIL);
      if (admin) {
        setCurrentUser(admin);
        return true;
      }
    }

    const user = users.find(u => u.email === email && u.role === 'USER');
    // For demo purposes, any password works for users if they exist
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const register = (fullName: string, email: string, password: string) => {
    if (users.find(u => u.email === email)) return false;
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      fullName,
      email,
      role: 'USER',
      balance: 1000, // Initial signup bonus
    };
    
    setUsers(prev => [...prev, newUser]);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const sendMoney = (toEmail: string, amount: number) => {
    if (!currentUser || currentUser.balance < amount || amount <= 0) return false;
    
    const receiver = users.find(u => u.email === toEmail);
    if (!receiver) return false;

    setUsers(prev => prev.map(u => {
      if (u.email === currentUser.email) return { ...u, balance: u.balance - amount };
      if (u.email === toEmail) return { ...u, balance: u.balance + amount };
      return u;
    }));

    // Update currentUser balance locally
    setCurrentUser(prev => prev ? { ...prev, balance: prev.balance - amount } : null);
    return true;
  };

  return (
    <AuthContext.Provider value={{ currentUser, users, login, register, logout, sendMoney }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
