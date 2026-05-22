'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Role = 'ADMIN' | 'USER';

export interface Transaction {
  id: string;
  name: string;
  desc: string;
  amount: string;
  type: 'in' | 'out';
  date: string;
  status: string;
  toFrom: string;
}

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
  transactions: Transaction[];
  login: (email: string, password: string) => boolean;
  register: (fullName: string, email: string, password: string) => boolean;
  logout: () => void;
  sendMoney: (toEmail: string, amount: number) => boolean;
  addBalance: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'Admin@gmail.com';
const ADMIN_PASSWORD = 'Admin123';

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Initialize with admin and any stored users
  useEffect(() => {
    const savedUsers = localStorage.getItem('vault_users');
    const savedTxns = localStorage.getItem('vault_transactions');
    const initialUsers: User[] = savedUsers ? JSON.parse(savedUsers) : [];

    const adminExists = initialUsers.find(u => u.email === ADMIN_EMAIL);
    const finalUsers = adminExists ? initialUsers : [
      { id: 'admin-0', fullName: 'System Administrator', email: ADMIN_EMAIL, role: 'ADMIN' as Role, balance: 1000000 },
      ...initialUsers
    ];

    setUsers(finalUsers);
    setTransactions(savedTxns ? JSON.parse(savedTxns) : []);
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('vault_users', JSON.stringify(users.filter(u => u.role !== 'ADMIN')));
    }
  }, [users]);

  useEffect(() => {
    localStorage.setItem('vault_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const login = (email: string, password: string) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const admin = users.find(u => u.email === ADMIN_EMAIL);
      if (admin) { setCurrentUser(admin); return true; }
    }
    const user = users.find(u => u.email === email && u.role === 'USER');
    if (user) { setCurrentUser(user); return true; }
    return false;
  };

  const register = (fullName: string, email: string, password: string) => {
    if (users.find(u => u.email === email)) return false;
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      fullName, email, role: 'USER', balance: 1000,
    };
    const signupTx: Transaction = {
      id: `TX-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      name: 'Signup Distribution',
      desc: 'Sovereign Foundation Bonus',
      amount: '+$1,000.00',
      type: 'in',
      date: formatDate(new Date()),
      status: 'Completed',
      toFrom: 'VaultVisio System',
    };
    setUsers(prev => [...prev, newUser]);
    setTransactions(prev => [signupTx, ...prev]);
    return true;
  };

  const logout = () => setCurrentUser(null);

  const sendMoney = (toEmail: string, amount: number) => {
    if (!currentUser || currentUser.balance < amount || amount <= 0) return false;
    const receiver = users.find(u => u.email === toEmail);
    if (!receiver) return false;

    const tx: Transaction = {
      id: `TX-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      name: `Transfer to ${receiver.fullName}`,
      desc: 'Intelligence Transfer',
      amount: `-$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      type: 'out',
      date: formatDate(new Date()),
      status: 'Completed',
      toFrom: toEmail,
    };

    setUsers(prev => prev.map(u => {
      if (u.email === currentUser.email) return { ...u, balance: u.balance - amount };
      if (u.email === toEmail) return { ...u, balance: u.balance + amount };
      return u;
    }));
    setCurrentUser(prev => prev ? { ...prev, balance: prev.balance - amount } : null);
    setTransactions(prev => [tx, ...prev]);
    return true;
  };

  const addBalance = (amount: number) => {
    if (!currentUser) return;
    const tx: Transaction = {
      id: `TX-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      name: 'AI Sweep Directive',
      desc: 'Autonomous Vault Optimization',
      amount: `+$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      type: 'in',
      date: formatDate(new Date()),
      status: 'Completed',
      toFrom: 'AI Engine',
    };
    setUsers(prev => prev.map(u =>
      u.email === currentUser.email ? { ...u, balance: u.balance + amount } : u
    ));
    setCurrentUser(prev => prev ? { ...prev, balance: prev.balance + amount } : null);
    setTransactions(prev => [tx, ...prev]);
  };

  return (
    <AuthContext.Provider value={{ currentUser, users, transactions, login, register, logout, sendMoney, addBalance }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
