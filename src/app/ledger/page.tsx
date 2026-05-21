'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Filter, Download, ArrowUpRight, ArrowDownRight, Printer, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function LedgerPage() {
  const { currentUser } = useAuth();
  const [selectedTx, setSelectedTx] = useState<any>(null);

  // Mock broader ledger data
  const transactions = [
    { id: 'TX-90210', name: "Sovereign AI Dividend", desc: "Automated Vault Sweep", amount: "+$3,420.00", type: "in", date: "May 21, 2026", status: "Completed" },
    { id: 'TX-90211', name: "Apple Store - 5th Ave", desc: "MacBook Pro M4 Max", amount: "-$4,299.00", type: "out", date: "May 20, 2026", status: "Completed" },
    { id: 'TX-90212', name: "Geneva Capital Partners", desc: "SWIFT Transfer (CHF -> USD)", amount: "+$125,000.00", type: "in", date: "May 19, 2026", status: "Completed" },
    { id: 'TX-90213', name: "Equinox Hudson Yards", desc: "Destination Membership", amount: "-$350.00", type: "out", date: "May 18, 2026", status: "Completed" },
    { id: 'TX-90214', name: "Stellar Asset Management", desc: "Liquidity Injection", amount: "+$50,000.00", type: "in", date: "May 15, 2026", status: "Completed" },
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans p-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#D4AF3715,transparent)] pointer-events-none" />

      <header className="max-w-6xl mx-auto flex items-center justify-between mb-12 relative z-10">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Financial <span className="text-gray-500 font-light">Ledger</span></h1>
        </div>
        <div className="flex items-center gap-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="text" placeholder="Search hash, entity..." className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-gold/30 transition-all" />
            </div>
            <button className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                <Filter className="w-4 h-4 text-gray-400" />
            </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto relative z-10">
        <div className="glass-dark border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Identity / Hash</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Timestamp</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.map((tx) => (
                <motion.tr 
                  key={tx.id}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                  onClick={() => setSelectedTx(tx)}
                  className="cursor-pointer group transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border border-white/10 ${tx.type === 'in' ? 'bg-emerald-500/10' : 'bg-white/5'}`}>
                        {tx.type === 'in' ? <ArrowDownRight className="w-4 h-4 text-emerald-400" /> : <ArrowUpRight className="w-4 h-4 text-gray-400" />}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-white group-hover:text-gold transition-colors">{tx.name}</p>
                        <p className="text-[10px] text-gray-500 font-mono">{tx.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs text-gray-400">{tx.date}</td>
                  <td className="px-8 py-6">
                    <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-tighter">
                      {tx.status}
                    </span>
                  </td>
                  <td className={`px-8 py-6 text-right font-bold tracking-tight ${tx.type === 'in' ? 'text-emerald-400' : 'text-white'}`}>
                    {tx.amount}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Receipt Modal */}
      <AnimatePresence>
        {selectedTx && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               onClick={() => setSelectedTx(null)}
               className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-[#0a0a0a] border border-gold/30 rounded-3xl overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,1)]"
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                    <ShieldCheck className="w-64 h-64 text-gold" />
                </div>

                <div className="p-10 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-6">
                        <ShieldCheck className="w-10 h-10 text-gold" />
                    </div>
                    <h2 className="text-gold font-bold tracking-[0.2em] text-sm uppercase mb-1">VaultVisio Certificate</h2>
                    <p className="text-gray-500 text-[10px] font-mono mb-10 italic">Auth ID: {selectedTx.id}-SEC-V2</p>

                    <div className="w-full space-y-4 mb-10">
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Beneficiary</span>
                            <span className="text-white text-sm font-bold">{selectedTx.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Sovereign Date</span>
                            <span className="text-white text-sm font-bold">{selectedTx.date}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Logic Hash</span>
                            <span className="text-white text-xs font-mono">{Math.random().toString(36).substring(2, 15).toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between pt-4">
                            <span className="text-gray-500 text-xs uppercase font-bold tracking-widest">Total Value</span>
                            <span className="text-gold text-2xl font-bold tracking-tighter">{selectedTx.amount}</span>
                        </div>
                    </div>

                    <div className="flex gap-4 w-full">
                        <button className="flex-1 py-3 rounded-xl bg-gold text-black font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" /> Download PDF
                        </button>
                        <button className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors">
                            <Printer className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="bg-white/5 p-4 text-center border-t border-white/5">
                   <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Encrypted Sovereign Document • VaultVisio Network</p>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
