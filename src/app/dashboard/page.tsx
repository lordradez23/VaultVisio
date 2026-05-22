'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Bell, Search, Sparkles, Send, ArrowUpRight, ArrowDownRight,
  RefreshCw, ShieldCheck, Zap, LogOut, Users, Settings, Activity,
  CreditCard, X, ChevronDown, Eye, EyeOff, Loader2, Lock, Unlock
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import AIChat from '@/components/AIChat';
import SovereignExchange from '@/components/SovereignExchange';
import AdminCommandCenter from '@/components/AdminCommandCenter';
import AdminUserAudit from '@/components/AdminUserAudit';

// ── Chart path data per period ─────────────────────────────────────────────
const CHART_PATHS: Record<string, { area: string; line: string }> = {
  '1D': {
    area: 'M0 40 L0 32 Q10 30,20 31 T40 28 T60 26 T80 22 T100 20 L100 40 Z',
    line: 'M0 32 Q10 30,20 31 T40 28 T60 26 T80 22 T100 20',
  },
  '1W': {
    area: 'M0 40 L0 35 Q10 33,20 30 T40 26 T60 24 T80 18 T100 15 L100 40 Z',
    line: 'M0 35 Q10 33,20 30 T40 26 T60 24 T80 18 T100 15',
  },
  '1M': {
    area: 'M0 40 L0 38 Q10 36,20 33 T40 30 T60 22 T80 18 T100 12 L100 40 Z',
    line: 'M0 38 Q10 36,20 33 T40 30 T60 22 T80 18 T100 12',
  },
  '6M': {
    area: 'M0 40 L0 30 Q10 25,20 28 T40 20 T60 15 T80 5 T100 8 L100 40 Z',
    line: 'M0 30 Q10 25,20 28 T40 20 T60 15 T80 5 T100 8',
  },
  '1Y': {
    area: 'M0 40 L0 36 Q10 32,20 34 T40 28 T50 20 T65 10 T80 6 T100 3 L100 40 Z',
    line: 'M0 36 Q10 32,20 34 T40 28 T50 20 T65 10 T80 6 T100 3',
  },
  'ALL': {
    area: 'M0 40 L0 38 Q10 37,20 36 T30 34 T45 28 T60 18 T75 8 T90 4 T100 2 L100 40 Z',
    line: 'M0 38 Q10 37,20 36 T30 34 T45 28 T60 18 T75 8 T90 4 T100 2',
  },
};

export default function Dashboard() {
  const { currentUser, logout, sendMoney, users, addBalance } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // Transfer form
  const [transferEmail, setTransferEmail] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // UI states
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [chartPeriod, setChartPeriod] = useState('6M');
  const [sweepUsed, setSweepUsed] = useState(false);
  const [sweepLoading, setSweepLoading] = useState(false);
  const [pulseLoading, setPulseLoading] = useState(false);
  const [cardExpanded, setCardExpanded] = useState<'details' | 'security' | null>(null);
  const [cardFrozen, setCardFrozen] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [adminLoadingBtn, setAdminLoadingBtn] = useState<string | null>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  // 3D Tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['15deg', '-15deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-15deg', '15deg']);
  const shimmerX = useTransform(mouseXSpring, [-0.5, 0.5], ['-100%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  // Close bell on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!currentUser) {
    return null;
  }

  const isAdmin = currentUser.role === 'ADMIN';

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    const amount = parseFloat(transferAmount);
    if (sendMoney(transferEmail, amount)) {
      setStatus({ type: 'success', msg: `Transferred $${amount} to ${transferEmail}` });
      toast(`✓ $${amount} transferred to ${transferEmail}`, 'success');
      setTransferAmount('');
      setTransferEmail('');
    } else {
      setStatus({ type: 'error', msg: 'Transfer failed. Check balance or recipient email.' });
      toast('Transfer failed. Check balance or recipient email.', 'error');
    }
  };

  const handleAISweep = () => {
    if (sweepUsed) return;
    setSweepLoading(true);
    setTimeout(() => {
      addBalance(1850);
      setSweepLoading(false);
      setSweepUsed(true);
      toast('AI Sweep executed — +$1,850.00 credited to vault', 'success');
    }, 2200);
  };

  const handleSecurePulse = () => {
    if (pulseLoading) return;
    setPulseLoading(true);
    toast('Initiating security pulse scan…', 'info');
    setTimeout(() => {
      setPulseLoading(false);
      toast('Secure Pulse complete — all systems nominal', 'success');
    }, 3000);
  };

  const handleAdminBtn = (label: string, successMsg: string) => {
    setAdminLoadingBtn(label);
    setTimeout(() => {
      setAdminLoadingBtn(null);
      toast(successMsg, 'success');
    }, 2000);
  };

  const notifications = [
    { title: 'AI Sweep Opportunity', body: 'New $42k logic shift detected.', time: '2m ago', dot: 'bg-gold' },
    { title: 'Card Activity', body: 'Transaction of $299 processed.', time: '1h ago', dot: 'bg-emerald-500' },
    { title: 'Security Pulse', body: 'Weekly biometric sync due.', time: '3h ago', dot: 'bg-blue-500' },
  ];

  // Search filters metrics labels (visual feedback only)
  const metricMatches = (label: string) => !searchQuery || label.toLowerCase().includes(searchQuery.toLowerCase());

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col font-sans pb-24 relative overflow-x-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] blur-[150px] rounded-full pointer-events-none" style={{ background: 'rgba(212,175,55,0.04)' }} />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] blur-[150px] rounded-full pointer-events-none" style={{ background: 'rgba(6,78,59,0.08)' }} />

      {/* Secure Pulse overlay */}
      <AnimatePresence>
        {pulseLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-ping" />
                <div className="absolute inset-4 rounded-full border-2 border-emerald-500/50 animate-ping [animation-delay:0.3s]" />
                <div className="absolute inset-8 rounded-full border-2 border-emerald-500/70 animate-ping [animation-delay:0.6s]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldCheck className="w-10 h-10 text-emerald-400" />
                </div>
              </div>
              <p className="text-emerald-400 font-bold uppercase tracking-[0.3em] text-sm">Scanning…</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="w-full border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-gold/50 transition-colors">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </div>
            </Link>
            <h1 className="text-xl font-bold tracking-tight">
              VaultVisio <span className="font-light text-gray-500">| {isAdmin ? 'System Control' : 'Intelligence'}</span>
            </h1>
          </div>

          <div className="flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={isAdmin ? 'Search system logs, users…' : 'Search metrics, assets…'}
                className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-gold/30 focus:bg-white/10 transition-all text-white placeholder-gray-600"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-3 h-3 text-gray-500 hover:text-white" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Bell */}
            <div className="relative" ref={bellRef}>
              <button
                onClick={() => setBellOpen(v => !v)}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors relative"
              >
                <Bell className="w-4 h-4 text-gray-300" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-gold rounded-full border border-black animate-pulse" />
              </button>
              <AnimatePresence>
                {bellOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    className="absolute right-0 top-14 w-80 glass-dark border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="px-5 py-4 border-b border-white/5 flex justify-between items-center">
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Notifications</p>
                      <button onClick={() => setBellOpen(false)}><X className="w-3 h-3 text-gray-600 hover:text-white" /></button>
                    </div>
                    {notifications.map((n, i) => (
                      <div key={i} className="flex gap-3 items-start px-5 py-4 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5 last:border-0">
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.dot}`} />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-white mb-0.5">{n.title}</p>
                          <p className="text-xs text-gray-500">{n.body}</p>
                        </div>
                        <span className="text-[10px] text-gray-600 shrink-0">{n.time}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <Link href="/profile" className="text-right hidden sm:block hover:opacity-70 transition-opacity">
                <p className="text-sm font-bold">{currentUser.fullName}</p>
                <p className="text-[10px] text-gold tracking-widest uppercase">{isAdmin ? 'Master Administrator' : 'Sovereign Tier'}</p>
              </Link>
              <button
                onClick={() => { logout(); router.push('/'); }}
                className="w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center font-bold text-black border-2 border-black ring-1 ring-gold/50 hover:brightness-125 transition-all group"
                style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.8), #92400e)' }}
              >
                <LogOut className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto w-full px-6 pt-10 flex flex-col gap-8 z-10">

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isAdmin ? (
            <>
              {[
                { label: 'Total System Assets', value: '$952,420,890', trend: '+1.2%', positive: true, sub: 'Aggregated vault values' },
                { label: 'Active Nodes', value: users.length.toString(), trend: 'Optimal', positive: true, sub: 'Authorized system users' },
                { label: 'Transaction Velocity', value: 'High', trend: '+24%', positive: true, sub: 'Network throughput' },
                { label: 'Security Status', value: 'Tier 1', trend: 'Stable', positive: true, sub: 'All protocols green' },
              ].filter(m => metricMatches(m.label)).map((metric, i) => (
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
                { label: 'Vault Balance', value: `$${currentUser.balance.toLocaleString()}`, trend: '+2.4%', positive: true, sub: 'Personal liquid assets' },
                { label: 'AI Directives', value: 'Active', trend: 'Optimal', positive: true, sub: 'Intelligence engine running' },
                { label: 'Monthly Yield', value: '+$14,250', trend: '+12.1%', positive: true, sub: 'Passive returns generated' },
                { label: 'Market Insulation', value: 'Active', trend: '-4.2%', positive: false, sub: 'Low volatility exposure' },
              ].filter(m => metricMatches(m.label)).map((metric, i) => (
                <div key={i} className="glass-dark border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-gray-500 text-xs font-bold tracking-widest uppercase">{metric.label}</h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${metric.positive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{metric.trend}</span>
                  </div>
                  <div className="text-3xl font-bold tracking-tight text-white mb-1">{metric.value}</div>
                  <div className="text-xs text-gray-600">{metric.sub}</div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {isAdmin ? (
              <div className="flex flex-col gap-8">
                <AdminCommandCenter />
                {selectedUserId ? (
                  <AdminUserAudit user={users.find(u => u.email === selectedUserId)} onBack={() => setSelectedUserId(null)} />
                ) : (
                  <div className="glass-dark border border-white/5 rounded-3xl p-8 flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-400" />
                        </div>
                        <h2 className="text-white text-xl font-bold">Client Directory</h2>
                      </div>
                      <button
                        onClick={() => handleAdminBtn('report', 'Report queued → sovereign_report_2026.pdf')}
                        className="text-xs font-bold text-gold border border-gold/20 px-4 py-2 rounded-lg hover:bg-gold/10 transition-colors uppercase tracking-widest flex items-center gap-2"
                      >
                        {adminLoadingBtn === 'report' ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                        Generate Report
                      </button>
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
                            <tr key={i} onClick={() => setSelectedUserId(user.email)} className="group hover:bg-white/5 transition-colors cursor-pointer">
                              <td className="py-4 font-bold text-white text-sm group-hover:text-gold transition-colors">{user.fullName}</td>
                              <td className="py-4 font-mono text-gray-500 text-xs">{user.email}</td>
                              <td className="py-4 text-right font-bold text-emerald-400 tracking-tight text-sm">${user.balance.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {/* Portfolio Velocity Chart */}
                <div className="glass-dark border border-white/5 rounded-3xl p-8 h-[420px] flex flex-col relative overflow-hidden">
                  <div className="flex justify-between items-end mb-8 relative z-10">
                    <div>
                      <h2 className="text-white text-xl font-bold mb-1">Portfolio Velocity</h2>
                      <p className="text-gray-500 text-sm">{chartPeriod === '6M' ? '6 Month' : chartPeriod === '1Y' ? '1 Year' : chartPeriod === 'ALL' ? 'All Time' : chartPeriod} Trajectory</p>
                    </div>
                    <div className="flex gap-1 bg-black/50 p-1 rounded-lg border border-white/10">
                      {(['1D', '1W', '1M', '6M', '1Y', 'ALL'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setChartPeriod(t)}
                          className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${chartPeriod === t ? 'bg-white/10 text-white shadow' : 'text-gray-500 hover:text-white'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 w-full relative z-10">
                    <motion.svg
                      key={chartPeriod}
                      className="w-full h-full"
                      viewBox="0 0 100 40"
                      preserveAspectRatio="none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <defs>
                        <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
                          <stop offset="90%" stopColor="#D4AF37" stopOpacity="0" />
                        </linearGradient>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                      </defs>
                      <motion.path
                        fill="url(#chart-grad)"
                        d={CHART_PATHS[chartPeriod].area}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                      />
                      <motion.path
                        fill="none"
                        stroke="#D4AF37"
                        strokeWidth="0.8"
                        filter="url(#glow)"
                        d={CHART_PATHS[chartPeriod].line}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                      />
                    </motion.svg>
                  </div>
                </div>

                <SovereignExchange />

                {/* Ledger Feed */}
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
                          <p className="text-emerald-400/70 text-xs font-bold uppercase tracking-widest">Sovereign Foundation</p>
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

            {/* AI / System Directives */}
            <div className="border border-gold/30 rounded-3xl p-1 bg-gradient-to-b from-gold/10 to-transparent relative overflow-hidden group">
              <div className="absolute inset-0 blur-2xl" style={{ background: 'rgba(212,175,55,0.04)' }} />
              <div className="absolute top-0 left-0 w-full h-[2px] animate-[scan_4s_linear_infinite]" style={{ background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)' }} />

              <div className="glass-dark rounded-[22px] p-6 h-full relative z-10 border border-white/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center border border-gold/40" style={{ background: 'rgba(212,175,55,0.15)' }}>
                    {isAdmin ? <Activity className="w-4 h-4 text-gold" /> : <Sparkles className="w-4 h-4 text-gold" />}
                  </div>
                  <h2 className="text-white font-bold text-lg">{isAdmin ? 'System Directives' : 'AI Directives'}</h2>
                </div>

                <div className="space-y-4">
                  {isAdmin ? (
                    <>
                      <div className="bg-black/40 border border-gold/20 rounded-xl p-4 flex gap-3 items-center">
                        <Zap className="w-4 h-4 text-gold shrink-0" />
                        <p className="text-xs text-gray-300 italic">"System running at full autonomous capacity."</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4 opacity-50 cursor-not-allowed">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">New Account Requests</p>
                        <p className="text-[10px] italic text-gray-600">Admin bypass required</p>
                      </div>
                    </>
                  ) : (
                    <div className="bg-black/40 border border-gold/20 rounded-xl p-4">
                      <Zap className="w-4 h-4 text-gold mb-2" />
                      <p className="text-xs text-gray-300 leading-relaxed mb-3">
                        Detected <span className="text-white font-bold">$42,000</span> logic shift. Execute sweep to gain{' '}
                        <span className="text-emerald-400">+$1,850</span>.
                      </p>
                      <button
                        onClick={handleAISweep}
                        disabled={sweepUsed || sweepLoading}
                        className={`w-full py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                          sweepUsed
                            ? 'bg-white/5 border border-white/10 text-gray-600 cursor-not-allowed'
                            : 'border border-gold/30 text-gold hover:bg-gold hover:text-black'
                          } ${sweepLoading ? 'opacity-70' : ''}`}
                        style={!sweepUsed && !sweepLoading ? { background: 'rgba(212,175,55,0.1)' } : {}}
                      >
                        {sweepLoading ? <><Loader2 className="w-3 h-3 animate-spin" /> Executing…</> : sweepUsed ? '✓ Sweep Executed' : 'Execute AI Sweep'}
                      </button>
                    </div>
                  )}

                  <button
                    onClick={handleSecurePulse}
                    disabled={pulseLoading}
                    className="w-full bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 flex gap-3 items-center hover:bg-emerald-500/10 transition-colors group"
                  >
                    {pulseLoading
                      ? <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                      : <ShieldCheck className="w-5 h-5 text-emerald-400 opacity-60 group-hover:opacity-100 transition-opacity" />}
                    <p className="text-[10px] text-emerald-400/80 font-bold uppercase tracking-widest">
                      {pulseLoading ? 'Scanning…' : 'Secure Pulse'}
                    </p>
                  </button>
                </div>
              </div>
            </div>

            {/* Sovereign Card */}
            {!isAdmin && (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center px-1">
                  <h2 className="text-white font-bold text-sm">Sovereign Card</h2>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-emerald-500/20" style={{ background: 'rgba(16,185,129,0.08)' }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] text-emerald-400 uppercase tracking-widest font-bold">Encrypted</span>
                  </div>
                </div>

                <motion.div
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                  className={`relative h-[220px] w-full rounded-2xl border p-6 flex flex-col justify-between overflow-hidden cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all ${
                    cardFrozen ? 'border-blue-500/30 opacity-70 grayscale' : 'border-white/10'
                  }`}
                  style={{ background: 'linear-gradient(135deg, #1a1a1a, #050505)' }}
                >
                  <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/20 transition-colors rounded-2xl pointer-events-none" />
                  <motion.div style={{ x: shimmerX, transformStyle: 'preserve-3d' }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
                  />

                  <div className="flex justify-between items-start relative z-10" style={{ transform: 'translateZ(50px)' }}>
                    <div className="flex flex-col">
                      <span className="text-gold font-bold tracking-[0.25em] text-xs">VAULTVISIO</span>
                      <span className="text-[8px] text-gray-500 font-mono tracking-widest mt-1">
                        {cardFrozen ? '❄ CARD FROZEN' : 'BLACK SOVEREIGN'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#EB001B] opacity-90" />
                      <div className="w-8 h-8 rounded-full bg-[#F79E1B] opacity-80 -ml-4" />
                    </div>
                  </div>

                  <div className="relative z-10" style={{ transform: 'translateZ(40px)' }}>
                    <div className="w-10 h-8 rounded-md opacity-80 mb-4 shadow-inner" style={{ background: 'linear-gradient(135deg, #FFD700, #B8860B)' }} />
                    <div className="text-white tracking-[0.25em] font-mono text-lg opacity-90">
                      {showCardNumber ? '4539 1488 0343 1337' : '**** **** **** 1337'}
                    </div>
                  </div>

                  <div className="flex justify-between items-end relative z-10" style={{ transform: 'translateZ(30px)' }}>
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

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCardExpanded(v => v === 'details' ? null : 'details')}
                    className={`flex-1 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1 ${cardExpanded === 'details' ? 'bg-gold/10 border-gold/30 text-gold' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`}
                  >
                    <CreditCard className="w-3 h-3" /> Details
                  </button>
                  <button
                    onClick={() => setCardExpanded(v => v === 'security' ? null : 'security')}
                    className={`flex-1 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1 ${cardExpanded === 'security' ? 'bg-gold/10 border-gold/30 text-gold' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`}
                  >
                    <Lock className="w-3 h-3" /> Security
                  </button>
                </div>

                {/* Expanded Panel */}
                <AnimatePresence>
                  {cardExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="glass-dark border border-white/10 rounded-2xl overflow-hidden"
                    >
                      <div className="p-5">
                        {cardExpanded === 'details' ? (
                          <div className="space-y-3">
                            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-4">Card Details</p>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">Card Number</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-white">
                                  {showCardNumber ? '4539 1488 0343 1337' : '**** **** **** 1337'}
                                </span>
                                <button onClick={() => setShowCardNumber(v => !v)}>
                                  {showCardNumber ? <EyeOff className="w-3 h-3 text-gray-500" /> : <Eye className="w-3 h-3 text-gray-500" />}
                                </button>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-500">Daily Limit</span>
                              <span className="text-xs font-bold text-white">$50,000</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-500">International</span>
                              <span className="text-xs font-bold text-emerald-400">Enabled</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-500">Contactless</span>
                              <span className="text-xs font-bold text-emerald-400">Active</span>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-4">Card Security</p>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-400">{cardFrozen ? 'Card Frozen' : 'Card Active'}</span>
                              <button
                                onClick={() => {
                                  setCardFrozen(v => !v);
                                  toast(cardFrozen ? 'Card unfrozen — transactions enabled' : '❄ Card frozen — all transactions blocked', cardFrozen ? 'success' : 'warning');
                                }}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                                  cardFrozen
                                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                                    : 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
                                }`}
                              >
                                {cardFrozen ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                {cardFrozen ? 'Unfreeze' : 'Freeze'}
                              </button>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-500">2FA</span>
                              <span className="text-xs font-bold text-emerald-400">Active</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-500">Biometric Lock</span>
                              <span className="text-xs font-bold text-emerald-400">Enabled</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Transfer / System Settings */}
            <div className="glass-dark border border-white/5 rounded-3xl p-6">
              <h2 className="text-white font-bold mb-4">{isAdmin ? 'System Settings' : 'Intelligence Transfer'}</h2>
              {isAdmin ? (
                <div className="space-y-3">
                  {[
                    { label: 'Audit System Logs', icon: Settings, key: 'audit', msg: 'Audit log exported → system_audit_2026.csv' },
                    { label: 'Network Maintenance', icon: RefreshCw, key: 'network', msg: 'Network maintenance cycle initiated — ETA 30s' },
                  ].map(({ label, icon: Icon, key, msg }) => (
                    <button
                      key={key}
                      onClick={() => handleAdminBtn(key, msg)}
                      disabled={adminLoadingBtn === key}
                      className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-xs font-bold flex items-center justify-between px-4 hover:bg-white/10 transition-all disabled:opacity-50"
                    >
                      <span>{label}</span>
                      {adminLoadingBtn === key
                        ? <Loader2 className="w-4 h-4 animate-spin opacity-60" />
                        : <Icon className="w-4 h-4 opacity-40" />}
                    </button>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleTransfer} className="space-y-4">
                  <div className="bg-black/50 border border-white/10 rounded-xl p-3">
                    <label className="text-[9px] uppercase tracking-widest text-gray-500 font-bold block mb-1">Recipient ID (Email)</label>
                    <input
                      type="email" required value={transferEmail}
                      onChange={e => setTransferEmail(e.target.value)}
                      placeholder="recipient@vaultvisio.com"
                      className="w-full bg-transparent text-white text-xs font-medium focus:outline-none"
                    />
                  </div>
                  <div className="bg-black/50 border border-white/10 rounded-xl p-3">
                    <label className="text-[9px] uppercase tracking-widest text-gray-500 font-bold block mb-1">Amount (Digital Reserve)</label>
                    <div className="flex items-center">
                      <span className="text-gray-500 font-bold mr-2">$</span>
                      <input
                        type="number" required value={transferAmount}
                        onChange={e => setTransferAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-transparent text-white font-bold text-lg focus:outline-none"
                      />
                    </div>
                  </div>
                  {status && (
                    <p className={`text-[10px] font-bold ${status.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>{status.msg}</p>
                  )}
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl text-black font-bold flex items-center justify-center gap-2 transition-all group hover:brightness-110"
                    style={{ background: '#D4AF37' }}
                  >
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
