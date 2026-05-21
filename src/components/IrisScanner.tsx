'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, ScanSearch } from 'lucide-react';

export default function IrisScanner({ onComplete }: { onComplete: () => void }) {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  const startScan = () => {
    setIsScanning(true);
    setProgress(0);
  };

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsScanning(false);
              onComplete();
            }, 1000);
            return 100;
          }
          return p + 1;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [isScanning, onComplete]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-black/40 rounded-2xl border border-white/10 overflow-hidden group">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ 
        backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)', 
        backgroundSize: '20px 20px' 
      }} />

      <AnimatePresence mode="wait">
        {!isScanning ? (
          <motion.button
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={startScan}
            className="flex flex-col items-center gap-4 group/btn"
          >
            <div className="w-20 h-20 rounded-full border-2 border-white/10 flex items-center justify-center group-hover/btn:border-gold/50 transition-all duration-500 relative">
                <div className="absolute inset-0 rounded-full border border-gold/0 group-hover/btn:border-gold/20 animate-ping" />
                <Eye className="w-8 h-8 text-gray-400 group-hover/btn:text-gold transition-colors" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 group-hover/btn:text-gold transition-colors">Initialize Iris Sync</span>
          </motion.button>
        ) : (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative flex flex-col items-center gap-8 w-full"
          >
            {/* The Iris Scanner SVG */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Outer Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle 
                    cx="96" cy="96" r="80" 
                    fill="none" 
                    stroke="rgba(212, 175, 55, 0.1)" 
                    strokeWidth="2" 
                />
                <motion.circle 
                    cx="96" cy="96" r="80" 
                    fill="none" 
                    stroke="#D4AF37" 
                    strokeWidth="2" 
                    strokeDasharray="502"
                    initial={{ strokeDashoffset: 502 }}
                    animate={{ strokeDashoffset: 502 - (502 * progress / 100) }}
                />
              </svg>

              {/* Inner Scanning Elements */}
              <div className="relative w-32 h-32 rounded-full border border-gold/20 flex items-center justify-center overflow-hidden">
                 <motion.div 
                    className="absolute inset-0 opacity-20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                 >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-gold" />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-gold" />
                 </motion.div>

                 <Eye className="w-12 h-12 text-gold animate-pulse" />

                 <motion.div 
                    className="absolute top-0 left-0 w-full h-[2px] bg-gold shadow-[0_0_15px_gold]"
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                 />
              </div>

              {/* Corner Brackets */}
              {[0, 90, 180, 270].map((deg) => (
                <div key={deg} className="absolute w-6 h-6 border-t-2 border-l-2 border-gold/40" style={{ 
                  transform: `rotate(${deg}deg) translate(-88px, -88px)` 
                }} />
              ))}
            </div>

            <div className="text-center space-y-2">
                <p className="text-gold text-[10px] font-bold uppercase tracking-[0.2em]">{progress}% Identity Verified</p>
                <p className="text-[8px] text-gray-500 font-mono tracking-widest uppercase italic">Logic Node: Geneva-01 / Syncing...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { AnimatePresence } from 'framer-motion';
