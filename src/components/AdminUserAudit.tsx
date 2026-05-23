'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, User, Globe, Activity, Lock, Unlock, CreditCard, DollarSign } from 'lucide-react';
import { useAuth, Transaction } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';
import { useState } from 'react';

interface AdminUserAuditProps {
  user: any;
  onBack: () => void;
}

export default function AdminUserAudit({ user, onBack }: AdminUserAuditProps) {
  const { suspendUser, adjustBalance, transactions } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');

  if (!user) return null;
  
  const userTxns = transactions.filter(t => t.toFrom === user.email || t.toFrom === 'VaultVisio System' || t.toFrom === 'Command Center' || t.toFrom === 'AI Engine');

  const handleAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!isNaN(val)) {
      adjustBalance(user.email, val);
      toast(`Adjusted balance by $${val.toLocaleString()}`, val >= 0 ? 'success' : 'warning');
      setAmount('');
    }
  };

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
        <div className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${user.suspended ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
            Client Profile: {user.suspended ? 'Suspended' : 'Active'}
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
                {userTxns.slice(0, 5).map((log, i) => (
                    <div key={i} className="flex justify-between items-center text-[10px] font-mono">
                        <div className="flex flex-col">
                            <span className="text-white">{log.name}</span>
                            <span className="text-gray-600">ID: {log.id}</span>
                        </div>
                        <div className="text-right flex flex-col">
                            <span className={log.type === 'in' ? 'text-emerald-400' : 'text-red-400'}>{log.amount}</span>
                            <span className="text-gray-500 italic">{log.date}</span>
                        </div>
                    </div>
                ))}
                {userTxns.length === 0 && <span className="text-gray-500 italic text-xs">No recent activity found.</span>}
            </div>
        </div>

        {/* Security Controls */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-6">
                <Shield className="w-4 h-4 text-emerald-400" />
                <h3 className="text-white text-sm font-bold uppercase tracking-widest">Administrative Actions</h3>
            </div>
            <div className="space-y-4">
                <form onSubmit={handleAdjust} className="flex gap-2">
                    <input 
                      type="number" 
                      value={amount} 
                      onChange={e => setAmount(e.target.value)}
                      placeholder="e.g. 500 or -500"
                      className="bg-black/50 border border-white/10 rounded-xl px-4 py-2 flex-1 text-xs text-white focus:outline-none focus:border-gold/50"
                    />
                    <button type="submit" className="px-4 py-2 bg-gold/10 text-gold border border-gold/30 rounded-xl text-[10px] uppercase tracking-widest font-bold hover:bg-gold hover:text-black transition-colors">
                        Post Adjustment
                    </button>
                </form>
            
                <div className="grid grid-cols-1 gap-2">
                    <button 
                        onClick={() => { suspendUser(user.email); toast(user.suspended ? 'User access restored' : 'User access suspended', user.suspended ? 'success' : 'error'); }}
                        className={`py-3 rounded-xl border text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-2 ${user.suspended ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white' : 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white'}`}>
                        {user.suspended ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                        {user.suspended ? 'Restore Access' : 'Terminate Access'}
                    </button>
                    <button onClick={() => toast('Re-issuing new Sovereign Card to client address', 'info')} className="py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-[10px] font-bold uppercase hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                        <CreditCard className="w-3 h-3" /> Re-Issue Card
                    </button>
                    <button onClick={() => toast('Jurisdictional node shifted successfully', 'success')} className="py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-[10px] font-bold uppercase hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                        <Globe className="w-3 h-3" /> Shift Jurisdictional Node
                    </button>
                </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
}
