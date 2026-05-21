'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Lock } from 'lucide-react';
import BiometricScanner from '@/components/BiometricScanner';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!fullName || !email || !password) {
      setError('Please provide all necessary details.');
      return;
    }

    const success = register(fullName, email, password);
    if (success) {
      setIsRegistered(true);
    } else {
      setError('An account with this email already exists.');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <Link href="/" className="absolute top-8 left-8 z-50 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium tracking-widest uppercase">Back</span>
      </Link>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="glass-dark border border-gold/10 p-10 rounded-3xl z-10 max-w-lg w-full text-center">
        {!isRegistered ? (
          <>
            <h1 className="text-4xl font-bold text-white mb-4 tracking-tighter">Establish Your <br/> <span className="text-gold">Sovereignty.</span></h1>
            <p className="text-gray-400 font-light mb-8 text-sm">Join the next era of sovereign banking. Please provide your legal details to initialize your vault.</p>
            
            <form onSubmit={handleRegister} className="space-y-4 mb-8 text-left">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center gap-2">
                  <User className="w-3 h-3" /> Full Legal Name
                </label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alexander Wright" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors text-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Digital Intelligence Address
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@vaultvisio.com" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors text-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center gap-2">
                  <Lock className="w-3 h-3" /> Security Directive (Password)
                </label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors text-sm" 
                />
              </div>
              {error && <p className="text-red-400 text-xs font-bold animate-pulse">{error}</p>}
              
              <button 
                type="submit"
                className="w-full py-4 rounded-xl bg-gold text-black font-bold text-sm tracking-widest uppercase hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              >
                Establish Baseline
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-white mb-4 tracking-tighter">Baseline Established.</h1>
            <p className="text-gray-400 font-light mb-8 text-sm text-shadow-gold">Finalize your identity baseline with a biometric scan to activate your vault.</p>
            <div className="bg-black/50 border border-gold/20 p-8 rounded-2xl mb-8">
              <BiometricScanner onSuccessRedirect="/dashboard" scanDurationMs={3000} />
            </div>
          </>
        )}

        <Link href="/" className="text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-[0.2em]">
          Abort Process
        </Link>
      </div>
    </div>
  );
}
