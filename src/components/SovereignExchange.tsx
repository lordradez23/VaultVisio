'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, ArrowRightLeft, TrendingUp, Shield, Coins } from 'lucide-react';

const ASSETS = [
  { id: 'USD', name: 'US Dollar', symbol: '$', rate: 1, color: 'text-white' },
  { id: 'CHF', name: 'Swiss Franc', symbol: 'Fr', rate: 0.88, color: 'text-emerald-400' },
  { id: 'GOLD', name: 'Sovereign Gold', symbol: 'oz', rate: 0.0004, color: 'text-gold' }
];

export default function SovereignExchange() {
  const [fromAsset, setFromAsset] = useState(ASSETS[0]);
  const [toAsset, setToAsset] = useState(ASSETS[1]);
  const [amount, setAmount] = useState('1000');
  const [isSwapping, setIsSwapping] = useState(false);

  const convertedValue = (parseFloat(amount) * (toAsset.rate / fromAsset.rate)).toFixed(2);

  const handleSwap = () => {
    setIsSwapping(true);
    setTimeout(() => {
      setIsSwapping(false);
      const temp = fromAsset;
      setFromAsset(toAsset);
      setToAsset(temp);
    }, 600);
  };

  return (
    <div className="glass-dark border border-white/5 rounded-3xl p-8 flex flex-col gap-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
        <Coins className="w-24 h-24 text-gold" />
      </div>

      <div className="flex justify-between items-center relative z-10">
        <div>
          <h2 className="text-white text-xl font-bold mb-1">Sovereign Exchange</h2>
          <p className="text-gray-500 text-sm">Instant asset rebalancing</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          <TrendingUp className="w-3 h-3 text-emerald-400" />
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Market Open</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center relative z-10">
        {/* From Asset */}
        <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-3">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">From Liquidity</label>
          <div className="flex justify-between items-center">
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent text-white text-2xl font-bold focus:outline-none w-2/3" 
            />
            <select 
              value={fromAsset.id} 
              onChange={(e) => setFromAsset(ASSETS.find(a => a.id === e.target.value) || ASSETS[0])}
              className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs font-bold text-white focus:outline-none"
            >
              {ASSETS.map(a => <option key={a.id} value={a.id}>{a.id}</option>)}
            </select>
          </div>
          <div className="text-[10px] text-gray-600 font-mono italic">Est. Balance: 124,400.00 {fromAsset.id}</div>
        </div>

        {/* Swap Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSwap}
          className="w-12 h-12 rounded-full bg-gold flex items-center justify-center border-4 border-black shadow-[0_0_20px_rgba(212,175,55,0.3)] z-20"
        >
          <RefreshCw className={`w-5 h-5 text-black ${isSwapping ? 'animate-spin' : ''}`} />
        </motion.button>

        {/* To Asset */}
        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-5 space-y-3">
          <label className="text-[10px] text-emerald-500/60 font-bold uppercase tracking-widest">To Reserve</label>
          <div className="flex justify-between items-center">
            <div className={`text-2xl font-bold ${toAsset.color}`}>{convertedValue}</div>
            <select 
              value={toAsset.id} 
              onChange={(e) => setToAsset(ASSETS.find(a => a.id === e.target.value) || ASSETS[0])}
              className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs font-bold text-white focus:outline-none"
            >
              {ASSETS.map(a => <option key={a.id} value={a.id}>{a.id}</option>)}
            </select>
          </div>
          <div className="text-[10px] text-emerald-500/40 font-mono">Rate: 1 {fromAsset.id} = {(toAsset.rate/fromAsset.rate).toFixed(4)} {toAsset.id}</div>
        </div>
      </div>

      <div className="flex gap-4 relative z-10 pt-2">
        <button className="flex-1 py-4 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-gold transition-colors flex items-center justify-center gap-2 group">
          <ArrowRightLeft className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          Authorize Exchange
        </button>
        <button className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
          <Shield className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Decorative Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
        <motion.div 
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="h-full bg-gold/30 shadow-[0_0_10px_gold]"
        />
      </div>
    </div>
  );
}
