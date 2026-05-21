import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import BiometricScanner from '@/components/BiometricScanner';

export default function Login() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <Link href="/" className="absolute top-8 left-8 z-50 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium tracking-widest uppercase">Back</span>
      </Link>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-light/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="glass-dark border border-white/10 p-12 rounded-3xl z-10 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
            <span className="text-gold font-bold text-xl">V</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tighter">Welcome Back</h1>
        <p className="text-gray-400 font-light text-sm mb-8">Enter your credentials to access your sovereign vault.</p>
        
        <div className="space-y-4 mb-8 text-left">
          <div className="space-y-2">
             <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Email / Vault ID</label>
             <input type="text" disabled placeholder="admin@vaultvisio.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-colors opacity-50 cursor-not-allowed" />
          </div>
          <div className="space-y-2">
             <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Password</label>
             <input type="password" disabled placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-colors opacity-50 cursor-not-allowed" />
          </div>
        </div>

        <div className="bg-black/50 border border-white/5 p-6 rounded-2xl mb-6">
          <BiometricScanner onSuccessRedirect="/dashboard" scanDurationMs={2500} />
        </div>

        <Link href="/" className="text-sm font-medium text-gold hover:text-white transition-colors">
          Return to Hub
        </Link>
      </div>
    </div>
  );
}
