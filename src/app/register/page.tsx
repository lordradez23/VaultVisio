import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import BiometricScanner from '@/components/BiometricScanner';

export default function Register() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <Link href="/" className="absolute top-8 left-8 z-50 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium tracking-widest uppercase">Back</span>
      </Link>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="glass-dark border border-gold/10 p-12 rounded-3xl z-10 max-w-lg w-full text-center">
        <h1 className="text-4xl font-bold text-white mb-4 tracking-tighter">Establish Your <br/> <span className="text-gold">Sovereignty.</span></h1>
        <p className="text-gray-400 font-light mb-8">Client applications are currently subject to review. Please initialize your biometric baseline to proceed.</p>
        
        <BiometricScanner onSuccessRedirect="/dashboard" scanDurationMs={3500} />

        <Link href="/" className="px-8 py-4 rounded-xl border border-white/10 hover:border-white/30 text-white font-bold block transition-all w-full">
          Abort Registration
        </Link>
      </div>
    </div>
  );
}
