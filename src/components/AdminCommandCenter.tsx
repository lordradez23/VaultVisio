'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Zap, Lock, Unlock, Loader2, Globe, Database, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function AdminCommandCenter() {
  const { toast } = useToast();
  const [isSystemLocked, setIsSystemLocked] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [networkLoad, setNetworkLoad] = useState(24);
  const [deployLoading, setDeployLoading] = useState(false);
  const [deployDone, setDeployDone] = useState(false);

  const toggleSystemLock = () => {
    setIsScanning(true);
    setTimeout(() => {
      const next = !isSystemLocked;
      setIsScanning(false);
      setIsSystemLocked(next);
      toast(next ? '🔒 System isolated — all transactions frozen' : '✓ System restored to operational status', next ? 'warning' : 'success');
    }, 2000);
  };

  const handleDeploy = () => {
    setDeployLoading(true);
    toast('Deploying Heuristic Shield…', 'info');
    setTimeout(() => {
      setDeployLoading(false);
      setDeployDone(true);
      toast('Heuristic Shield active — Singapore node secured', 'success');
    }, 3000);
  };

  // Simulate live network load
  React.useEffect(() => {
    const interval = setInterval(() => {
      setNetworkLoad(prev => Math.min(95, Math.max(10, prev + Math.floor(Math.random() * 11) - 5)));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-dark border border-white/5 rounded-3xl p-8 flex flex-col gap-8 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-64 h-64 blur-[100px] rounded-full transition-colors duration-1000 ${isSystemLocked ? 'bg-red-500/20' : 'bg-emerald-500/10'}`} />

      <div className="flex justify-between items-start relative z-10">
        <div>
          <h2 className="text-white text-xl font-bold mb-1">Command Center</h2>
          <p className="text-gray-500 text-sm italic">Master System Override</p>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full animate-pulse ${isSystemLocked ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {/* Network Metrics */}
        <div className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            <span>Network Throughput</span>
            <motion.span
              key={networkLoad}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className={networkLoad > 70 ? 'text-orange-400' : 'text-emerald-400'}
            >
              {networkLoad}%
            </motion.span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${networkLoad}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full bg-gradient-to-r ${networkLoad > 70 ? 'from-orange-500 to-orange-300' : 'from-emerald-500 to-emerald-300'}`}
            />
          </div>
          <div className="flex gap-4 pt-2">
            <div className="flex items-center gap-2">
              <Globe className="w-3 h-3 text-gray-600" />
              <span className="text-[10px] text-gray-400 font-mono">Nodes: 14</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-3 h-3 text-gray-600" />
              <span className="text-[10px] text-gray-400 font-mono">Sync: 100%</span>
            </div>
          </div>
        </div>

        {/* System Lock */}
        <div className={`border rounded-2xl p-6 flex flex-col justify-between transition-colors duration-500 ${isSystemLocked ? 'bg-red-500/5 border-red-500/30' : 'bg-white/5 border-white/10'}`}>
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg ${isSystemLocked ? 'bg-red-500/20' : 'bg-emerald-500/10'}`}>
              {isSystemLocked ? <Lock className="w-5 h-5 text-red-400" /> : <Unlock className="w-5 h-5 text-emerald-400" />}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${isSystemLocked ? 'text-red-400' : 'text-emerald-400'}`}>
              {isSystemLocked ? 'System Isolated' : 'System Operational'}
            </span>
          </div>
          <button
            onClick={toggleSystemLock}
            disabled={isScanning}
            className={`w-full py-3 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
              isScanning ? 'bg-white/5 text-gray-500' :
              isSystemLocked ? 'bg-emerald-500 text-black hover:bg-white' :
              'bg-red-500 text-white hover:bg-white hover:text-black shadow-[0_0_20px_rgba(239,68,68,0.3)]'
            }`}
          >
            {isScanning ? <><Loader2 className="w-4 h-4 animate-spin" /> Authorizing…</> :
              isSystemLocked ? 'Lift System Lock' : 'Initiate Kill-Switch'}
          </button>
        </div>
      </div>

      {/* Volatility Alert */}
      <div className="rounded-2xl p-6 relative z-10 flex gap-4 items-center border border-gold/20" style={{ background: 'rgba(212,175,55,0.04)' }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 border border-gold/30" style={{ background: 'rgba(212,175,55,0.08)' }}>
          <ShieldAlert className="w-6 h-6 text-gold" />
        </div>
        <div className="flex-1">
          <h4 className="text-gold text-xs font-bold uppercase tracking-widest mb-1">Volatility Alert</h4>
          <p className="text-gray-400 text-[11px] leading-relaxed">
            Detected unusual SWIFT activity in Singapore node. Recommend <span className="text-white font-bold">Heuristic Shield</span> activation.
          </p>
        </div>
        <AnimatePresence mode="wait">
          {deployDone ? (
            <motion.div key="done" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase">
              <CheckCircle className="w-3.5 h-3.5" /> Active
            </motion.div>
          ) : (
            <button
              key="deploy"
              onClick={handleDeploy}
              disabled={deployLoading}
              className="ml-auto px-4 py-2 rounded-lg text-gold text-[10px] font-bold uppercase hover:text-black transition-all flex items-center gap-2 border border-gold/30 hover:bg-gold disabled:opacity-50"
              style={{ background: 'rgba(212,175,55,0.15)' }}
            >
              {deployLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
              {deployLoading ? 'Deploying…' : 'Deploy'}
            </button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
