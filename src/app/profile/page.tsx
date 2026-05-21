'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, User, ShieldCheck, Fingerprint, Camera, Bell, Settings, CreditCard, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import IrisScanner from '@/components/IrisScanner';

export default function ProfilePage() {
  const { currentUser, logout } = useAuth();

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans p-8 relative overflow-hidden">
        {/* Background Ambience */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
        
        <header className="max-w-4xl mx-auto flex items-center justify-between mb-12 relative z-10">
            <Link href="/dashboard" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <h1 className="text-xl font-bold tracking-tight uppercase tracking-widest">Sovereign Profile</h1>
            <button onClick={logout} className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all text-red-400">
                <LogOut className="w-4 h-4" />
            </button>
        </header>

        <main className="max-w-4xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-8">
            {/* Left: Identity Card */}
            <div className="flex flex-col gap-6">
                <div className="glass-dark border border-white/5 rounded-3xl p-8 flex flex-col items-center text-center">
                    <div className="relative mb-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold to-yellow-700 p-1">
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                <User className="w-12 h-12 text-gold/50" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 rounded-full border-4 border-black flex items-center justify-center">
                            <ShieldCheck className="w-3 h-3 text-white" />
                        </div>
                    </div>
                    <h2 className="text-xl font-bold mb-1">{currentUser.fullName}</h2>
                    <p className="text-gray-500 text-xs font-mono mb-6">{currentUser.email}</p>
                    
                    <div className="w-full grid grid-cols-2 gap-2">
                        <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                            <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest mb-1">Role</p>
                            <p className="text-xs font-bold text-gold">{currentUser.role === 'ADMIN' ? 'MASTER' : 'SOVEREIGN'}</p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                            <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest mb-1">Status</p>
                            <p className="text-xs font-bold text-emerald-400 tracking-tighter">Verified</p>
                        </div>
                    </div>
                </div>

                <div className="glass-dark border border-white/5 rounded-3xl p-6">
                    <h3 className="text-white text-sm font-bold mb-4">Security Baseline</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-3">
                                <Fingerprint className="w-4 h-4 text-gold" />
                                <span className="text-xs text-gray-400">Fingerprint Key</span>
                            </div>
                            <span className="text-[10px] text-emerald-400 font-bold uppercase">Active</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-3">
                                <Camera className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs text-gray-400">Eye-Iris Sync</span>
                            </div>
                            <span className="text-[10px] text-emerald-400 font-bold uppercase">Active</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Actions & Calibration */}
            <div className="flex flex-col gap-6">
                <div className="glass-dark border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold/40 to-transparent animate-[scan_4s_linear_infinite]" />
                    
                    <div className="relative z-10">
                        <h3 className="text-white text-lg font-bold mb-2">Biometric Calibration</h3>
                        <p className="text-gray-400 text-sm mb-8">Maintain high-fidelity identity markers by refreshing your biometric baseline weekly.</p>
                        
                        <div className="relative h-64 bg-black/50 rounded-2xl border border-white/10 mb-8 flex items-center justify-center overflow-hidden">
                            <IrisScanner onComplete={() => alert('Biometric Baseline Synchronized.')} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button className="glass-dark border border-white/5 rounded-2xl p-6 flex flex-col items-center gap-3 hover:border-gold/30 transition-all">
                        <Bell className="w-6 h-6 text-gold" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Alerts</span>
                    </button>
                    <button className="glass-dark border border-white/5 rounded-2xl p-6 flex flex-col items-center gap-3 hover:border-gold/30 transition-all">
                        <Settings className="w-6 h-6 text-gold" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Settings</span>
                    </button>
                </div>
            </div>
        </main>
    </div>
  );
}
