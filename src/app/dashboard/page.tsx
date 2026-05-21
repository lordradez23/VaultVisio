'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bell, Search, Sparkles, Send, ArrowUpRight, ArrowDownRight, RefreshCw, ShieldCheck, Zap, LogOut, Users, Settings, Activity, CreditCard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import AIChat from '@/components/AIChat';
import SovereignExchange from '@/components/SovereignExchange';
import AdminCommandCenter from '@/components/AdminCommandCenter';

export default function Dashboard() {
  const { currentUser, logout, sendMoney, users } = useAuth();
  const router = useRouter();
  
  const [transferEmail, setTransferEmail] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (!currentUser) {
    if (typeof window !== 'undefined') {
      router.push('/login');
    }
    return null;
  }

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    const amount = parseFloat(transferAmount);
    
    if (sendMoney(transferEmail, amount)) {
      setStatus({ type: 'success', msg: `Successfully transferred $${amount} to ${transferEmail}` });
      setTransferAmount('');
      setTransferEmail('');
    } else {
      setStatus({ type: 'error', msg: 'Transfer failed. Check balance or recipient email.' });
    }
  };

  const isAdmin = currentUser.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col font-sans pb-24 relative overflow-x-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-900/10 blur-[150px] rounded-full pointer-events-none" />
      
      {/* Top Header Navbar */}
      <header className="w-full border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-gold/50 transition-colors">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </div>
            </Link>
            <h1 className="text-xl font-bold tracking-tight">VaultVisio <span className="font-light text-gray-500">| {isAdmin ? 'System Control' : 'Intelligence'}</span></h1>
          </div>

          <div className="flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" placeholder={isAdmin ? "Search system logs, users..." : "Search commands, assets..."} className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-gold/30 focus:bg-white/10 transition-all text-white placeholder-gray-600" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors relative">
              <Bell className="w-4 h-4 text-gray-300" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-gold rounded-full border border-black animate-pulse" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <Link href="/profile" className="text-right hidden sm:block hover:opacity-70 transition-opacity">
                <p className="text-sm font-bold">{currentUser.fullName}</p>
                <p className="text-[10px] text-gold tracking-widest uppercase">{isAdmin ? 'Master Administrator' : 'Sovereign Tier'}</p>
              </Link>
              <button 
                onClick={logout}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/80 to-yellow-800 flex items-center justify-center font-bold text-black border-2 border-black ring-1 ring-gold/50 hover:brightness-125 transition-all group"
              >
                <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto w-full px-6 pt-10 flex flex-col gap-8 z-10">
        
        {/* Core Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isAdmin ? (
            <>
              {[
                { label: "Total System Assets", value: "$952,420,890", trend: "+1.2%", positive: true, sub: "Aggregated vault values" },
                { label: "Active Nodes", value: users.length.toString(), trend: "Optimal", positive: true, sub: "Authorized system users" },
                { label: "Transaction Velocity", value: "High", trend: "+24%", positive: true, sub: "Network throughput" },
                { label: "Security Status", value: "Tier 1", trend: "Stable", positive: true, sub: "All protocols green" }
              ].map((metric, i) => (
                <div key={i} className="glass-dark border border-white/5 rounded-2xl p-6 hover:border-gold/20 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-gray-500 text-xs font-bold tracking-widest uppercase">{metric.label}</h3>
                    <span className="text-xs font-bold px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400">{metric.trend}</span>
                  </div>
                  <div className="text-3xl font-bold tracking-tight text-white mb-1">{metric.value}</div>
                  <div className="text-xs text-gray-600 font-mono tracking-tighter">{metric.sub}</div>
                </div>
              ))}
            </>
          ) : (
            <>
              {[
                { label: "Vault Balance", value: `$${currentUser.balance.toLocaleString()}`, trend: "+2.4%", positive: true, sub: "Personal liquid assets" },
                { label: "AI Directives", value: "Active", trend: "Optimal", positive: true, sub: "Intelligence engine running" },
                { label: "Monthly Yield", value: "+$14,250", trend: "+12.1%", positive: true, sub: "Passive returns generated" },
                { label: "Market Insulation", value: "Active", trend: "-4.2%", positive: true, sub: "Low volatility exposure" }
              ].map((metric, i) => (
                <div key={i} className="glass-dark border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-gray-500 text-xs font-bold tracking-widest uppercase">{metric.label}</h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${metric.positive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {metric.trend}
                    </span>
                  </div>
                  <div className="text-3xl font-bold tracking-tight text-white mb-1">{metric.value}</div>
                  <div className="text-xs text-gray-600">{metric.sub}</div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Main Grid: Left (Charts/Users) + Right (Directives/Transfer) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {isAdmin ? (
               <div className="flex flex-col gap-8">
                 <AdminCommandCenter />
                 {/* User Management for Admins */}
               <div className="glass-dark border border-white/5 rounded-3xl p-8 flex flex-col">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-400" />
                      </div>
                      <h2 className="text-white text-xl font-bold">Client Directory</h2>
                    </div>
                    <button className="text-xs font-bold text-gold border border-gold/20 px-4 py-2 rounded-lg hover:bg-gold/10 transition-colors uppercase tracking-widest">Generate Report</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className="py-4 text-[10px] text-gray-500 uppercase tracking-widest font-bold">Client Name</th>
                          <th className="py-4 text-[10px] text-gray-500 uppercase tracking-widest font-bold">Digital Identity</th>
                          <th className="py-4 text-[10px] text-gray-500 uppercase tracking-widest font-bold text-right">Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {users.filter(u => u.role === 'USER').map((user, i) => (
                          <tr key={i} className="group hover:bg-white/5 transition-colors">
                            <td className="py-4 font-bold text-white text-sm">{user.fullName}</td>
                            <td className="py-4 font-mono text-gray-500 text-xs">{user.email}</td>
                            <td className="py-4 text-right font-bold text-emerald-400 tracking-tight text-sm">${user.balance.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>
               </div>
            ) : (
               /* Portfolio Velocity for Users */
               <div className="glass-dark border border-white/5 rounded-3xl p-8 h-[450px] flex flex-col relative overflow-hidden group">
                 <div className="flex justify-between items-end mb-8 relative z-10">
                   <div>
                     <h2 className="text-white text-xl font-bold mb-1">Portfolio Velocity</h2>
                     <p className="text-gray-500 text-sm">6 Month Trajectory</p>
                   </div>
                   <div className="flex gap-2 bg-black/50 p-1 rounded-lg border border-white/10">
                     {['1D', '1W', '1M', '6M', '1Y', 'ALL'].map((time, idx) => (
                       <button key={time} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${idx === 3 ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}>
                         {time}
                       </button>
                     ))}
                   </div>
                 </div>
                 <div className="flex-1 w-full relative z-10">
                   <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                     <defs>
                       <linearGradient id="main-chart-grad" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
                         <stop offset="90%" stopColor="#D4AF37" stopOpacity="0" />
                       </linearGradient>
                       <filter id="glow">
                         <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                         <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                       </filter>
                     </defs>
                     <path fill="url(#main-chart-grad)" d="M0 40 L0 30 Q 10 25, 20 28 T 40 20 T 60 15 T 80 5 T 100 8 L100 40 Z" />
                     <path fill="none" stroke="#D4AF37" strokeWidth="0.8" filter="url(#glow)" d="M0 30 Q 10 25, 20 28 T 40 20 T 60 15 T 80 5 T 100 8" />
                   </svg>
                 </div>
                 </div>
                 
                 <SovereignExchange />

                 <div className="glass-dark border border-white/5 rounded-3xl p-8 flex flex-col">
                   <div className="flex justify-between items-center mb-8">
                     <h2 className="text-white text-xl font-bold">Ledger Feed</h2>
                     <Link href="/ledger" className="text-xs font-bold text-gold hover:text-white transition-colors uppercase tracking-widest">View All</Link>
                   </div>
                   <div className="flex flex-col gap-2">
                     <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20">
                           <ArrowDownRight className="w-5 h-5 text-emerald-400" />
                         </div>
                         <div>
                           <h4 className="text-white font-bold mb-1">Signup Distribution</h4>
                           <p className="text-gray-500 text-xs text-emerald-400/70 font-bold uppercase tracking-widest">Sovereign Foundation</p>
                         </div>
                       </div>
                       <div className="text-right">
                         <h4 className="font-bold tracking-tight mb-1 text-emerald-400">+$1,000.00</h4>
                         <p className="text-gray-600 text-[10px] font-bold uppercase tracking-tighter">Identity Initialized</p>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
            )}

          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-8">

            {/* Role Specific Control Panel */}
            <div className="border border-gold/30 rounded-3xl p-1 bg-gradient-to-b from-gold/10 to-transparent relative overflow-hidden group">
              <div className="absolute inset-0 bg-gold/5 blur-2xl group-hover:bg-gold/10 transition-colors" />
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold/40 to-transparent animate-[scan_4s_linear_infinite]" />
              
              <div className="glass-dark rounded-[22px] p-6 h-full relative z-10 border border-white/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center border border-gold/40">
                    {isAdmin ? <Activity className="w-4 h-4 text-gold" /> : <Sparkles className="w-4 h-4 text-gold" />}
                  </div>
                  <h2 className="text-white font-bold text-lg">{isAdmin ? 'System Directives' : 'AI Directives'}</h2>
                </div>
                
                <div className="space-y-4">
                  {isAdmin ? (
                    <>
                      <div className="bg-black/40 border border-gold/20 rounded-xl p-4 flex gap-3 items-center">
                        <Zap className="w-4 h-4 text-gold" />
                        <p className="text-xs text-gray-300 antialiased italic">"System is running at full autonomous capacity. Low manual intervention required."</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4 cursor-not-allowed opacity-50">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">New Account Requests</p>
                        <p className="text-[10px] italic">Admin bypass required to enable registration</p>
                      </div>
                    </>
                  ) : (
                    <div className="bg-black/40 border border-gold/20 rounded-xl p-4">
                       <Zap className="w-4 h-4 text-gold mb-2" />
                       <p className="text-xs text-gray-300 leading-relaxed">
                         Detected <span className="text-white font-bold">$42,000</span> logic shift. Execute sweep to gain <span className="text-emerald-400">+$1,850</span>.
                       </p>
                       <button className="w-full mt-3 py-2 rounded-lg bg-gold/20 border border-gold/30 text-gold text-[10px] font-bold uppercase tracking-widest">Execute AI Sweep</button>
                    </div>
                  )}
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 flex gap-3 items-center">
                     <ShieldCheck className="w-5 h-5 text-emerald-400 opacity-60" />
                     <p className="text-[10px] text-emerald-400/80 font-bold uppercase tracking-widest">Secure Pulse</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Card - Restored for Users with 3D Tilt */}
            {!isAdmin && (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center px-1">
                  <h2 className="text-white font-bold text-sm">Sovereign Card</h2>
                  <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] text-emerald-400 uppercase tracking-widest font-bold">Encrypted</span>
                  </div>
                </div>
                
                <motion.div
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                  className="relative h-[220px] w-full rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#050505] border border-white/10 p-6 flex flex-col justify-between overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer"
                >
                  {/* Glowing Edge */}
                  <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/20 transition-colors rounded-2xl pointer-events-none" />
                  
                  {/* Moving Shimmer Reflection */}
                  <motion.div 
                    style={{ x: useTransform(mouseXSpring, [-0.5, 0.5], ["-100%", "100%"]), transformStyle: "preserve-3d" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none" 
                  />

                  <div className="flex justify-between items-start relative z-10" style={{ transform: "translateZ(50px)" }}>
                    <div className="flex flex-col">
                      <span className="text-gold font-bold tracking-[0.25em] text-xs">VAULTVISIO</span>
                      <span className="text-[8px] text-gray-500 font-mono tracking-widest mt-1">BLACK SOVEREIGN</span>
                    </div>
                    <div className="flex items-center">
                       <div className="w-8 h-8 rounded-full bg-[#EB001B] opacity-90" />
                       <div className="w-8 h-8 rounded-full bg-[#F79E1B] opacity-80 -ml-4" />
                    </div>
                  </div>

                  <div className="relative z-10" style={{ transform: "translateZ(40px)" }}>
                    <div className="w-10 h-8 bg-gradient-to-br from-[#FFD700] to-[#B8860B] rounded-md opacity-80 mb-4 shadow-inner" />
                    <div className="text-white tracking-[0.25em] font-mono text-lg opacity-90">
                      **** **** **** 1337
                    </div>
                  </div>

                  <div className="flex justify-between items-end relative z-10" style={{ transform: "translateZ(30px)" }}>
                    <div>
                      <p className="text-[8px] text-gray-500 uppercase tracking-widest mb-1">Cardholder</p>
                      <p className="text-[11px] text-white font-bold tracking-wider">{currentUser.fullName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] text-gray-500 uppercase tracking-widest mb-1">Expiry</p>
                      <p className="text-[11px] text-white font-bold">12 / 30</p>
                    </div>
                  </div>
                </motion.div>
                
                <div className="flex items-center gap-2">
                  <button className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 text-[10px] font-bold uppercase tracking-widest transition-all">Details</button>
                  <button className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 text-[10px] font-bold uppercase tracking-widest transition-all">Security</button>
                </div>
              </div>
            )}

            {/* Quick Actions / Digital Money Transfer */}
            <div className="glass-dark border border-white/5 rounded-3xl p-6">
              <h2 className="text-white font-bold mb-4">{isAdmin ? 'System Settings' : 'Intelligence Transfer'}</h2>
              {isAdmin ? (
                <div className="space-y-3">
                  <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-xs font-bold flex items-center justify-between px-4 hover:bg-white/10 transition-all">
                    <span>Audit System Logs</span>
                    <Settings className="w-4 h-4 opacity-40" />
                  </button>
                  <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-xs font-bold flex items-center justify-between px-4 hover:bg-white/10 transition-all">
                    <span>Network Maintenance</span>
                    <RefreshCw className="w-4 h-4 opacity-40" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTransfer} className="space-y-4">
                    <div className="bg-black/50 border border-white/10 rounded-xl p-3">
                      <label className="text-[9px] uppercase tracking-widest text-gray-500 font-bold block mb-1">Recipient ID (Email)</label>
                      <input 
                        type="email" 
                        required
                        value={transferEmail}
                        onChange={(e) => setTransferEmail(e.target.value)}
                        placeholder="recipient@vaultvisio.com" 
                        className="w-full bg-transparent text-white text-xs font-medium focus:outline-none" 
                      />
                    </div>
                    <div className="bg-black/50 border border-white/10 rounded-xl p-3">
                      <label className="text-[9px] uppercase tracking-widest text-gray-500 font-bold block mb-1">Amount (Digital Reserve)</label>
                      <div className="flex items-center">
                        <span className="text-gray-500 font-bold mr-2">$</span>
                        <input 
                          type="number" 
                          required
                          value={transferAmount}
                          onChange={(e) => setTransferAmount(e.target.value)}
                          placeholder="0.00" 
                          className="w-full bg-transparent text-white font-bold text-lg focus:outline-none" 
                        />
                      </div>
                    </div>
                    {status && (
                      <p className={`text-[10px] font-bold ${status.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {status.msg}
                      </p>
                    )}
                    <button type="submit" className="w-full py-3 rounded-xl bg-gold hover:bg-white text-black font-bold flex items-center justify-center gap-2 transition-all group">
                       <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                       <span className="uppercase tracking-widest text-[10px]">Initialize Transfer</span>
                    </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </main>
      <AIChat />
    </div>
  );
}
