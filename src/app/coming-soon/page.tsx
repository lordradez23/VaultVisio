import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <Link href="/" className="absolute top-8 left-8 z-50 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium tracking-widest uppercase">Back</span>
      </Link>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="glass-dark border border-white/10 p-12 rounded-3xl z-10 max-w-lg w-full text-center">
        <h1 className="text-5xl font-bold text-white mb-6 tracking-tighter">Protocol <br/> <span className="text-gray-500">Unreleased</span></h1>
        <p className="text-gray-400 font-light mb-10 leading-relaxed">The internal engineering team is finalizing this module of the VaultVisio system. Check back soon for deployment.</p>
        
        <Link href="/" className="inline-block px-8 py-4 rounded-xl bg-white hover:bg-gray-200 text-black font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          Back to Terminal
        </Link>
      </div>
    </div>
  );
}
