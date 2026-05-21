'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, User, Globe, Activity, Lock, Unlock, CreditCard } from 'lucide-react';

interface AdminUserAuditProps {
  user: any;
  onBack: () => void;
}

export default function AdminUserAudit({ user, onBack }: AdminUserAuditProps) {
  if (!user) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-dark border border-white/5 rounded-3xl p-8 flex flex-col gap-8"
    >
      <div className="flex items-center justify-between">
        <button 
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gold transition-colors uppercase tracking-widest"
        >
            <ArrowLeft className="w-4 h-4" />
            Back to Directory
        </button>
        <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
            Client Profile: Active
        </div>
      </div>

      <div className="flex items-start gap-8">
         <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
            <User className="w-12 h-12 text-gray-700" />
         </div>
         <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-1">{user.fullName}</h2>
            <p className="text-gray-500 font-mono text-sm mb-4">{user.email}</p>
            <div className="flex gap-4">
                <div className="bg-black/40 px-3 py-2 rounded-xl border border-white/5">
                    <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest mb-1">Current Liquidity</p>
                    <p className="text-sm font-bold text-emerald-400">${user.balance.toLocaleString()}</p>
                </div>
                <div className="bg-black/40 px-3 py-2 rounded-xl border border-white/5">
                    <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest mb-1">Tier</p>
                    <p className="text-sm font-bold text-gold uppercase tracking-tighter">Sovereign</p>
                </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Activity Log */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-6">
                <Activity className="w-4 h-4 text-gold" />
                <h3 className="text-white text-sm font-bold uppercase tracking-widest">Access Logs</h3>
            </div>
            <div className="space-y-4">
                {[
                    { event: "Identity Handshake", node: "Geneva-01", time: "2m ago" },
                    { event: "Sovereign Sweep", node: "Global-AI", time: "1h ago" },
                    { event: "Exchange Authorization", node: "Singapore-02", time: "3h ago" },
                ].map((log, i) => (
                    <div key={i} className="flex justify-between items-center text-[10px] font-mono">
                        <div className="flex flex-col">
                            <span className="text-white">{log.event}</span>
                            <span className="text-gray-600">Node: {log.node}</span>
                        </div>
                        <span className="text-gray-500 italic">{log.time}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Security Controls */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-6">
                <Shield className="w-4 h-4 text-emerald-400" />
                <h3 className="text-white text-sm font-bold uppercase tracking-widest">Administrative Actions</h3>
            </div>
            <div className="grid grid-cols-1 gap-2">
                <button className="py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2">
                    <Lock className="w-3 h-3" /> Terminate Access
                </button>
                <button className="py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-[10px] font-bold uppercase hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    <CreditCard className="w-3 h-3" /> Re-Issue Card
                </button>
                <button className="py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-[10px] font-bold uppercase hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    <Globe className="w-3 h-3" /> Shift Jurisdictional Node
                </button>
            </div>
        </div>
      </div>
    </motion.div>
  );
}
