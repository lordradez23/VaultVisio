import Link from 'next/link';
import { ArrowLeft, Bell, Search, Sparkles, Send, ArrowUpRight, ArrowDownRight, RefreshCw, ShieldCheck, Zap } from 'lucide-react';

export default function Dashboard() {
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
            <h1 className="text-xl font-bold tracking-tight">VaultVisio <span className="font-light text-gray-500">| Intelligence</span></h1>
          </div>

          <div className="flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" placeholder="Search commands, assets, or directives..." className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-gold/30 focus:bg-white/10 transition-all text-white placeholder-gray-600" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors relative">
              <Bell className="w-4 h-4 text-gray-300" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-gold rounded-full border border-black animate-pulse" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">Alexander W.</p>
                <p className="text-[10px] text-gold tracking-widest uppercase">Sovereign Tier</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-yellow-700 flex items-center justify-center font-bold text-black border-2 border-black ring-1 ring-gold/50">
                AW
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto w-full px-6 pt-10 flex flex-col gap-8 z-10">
        
        {/* Core Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Net Worth", value: "$4,250,890.00", trend: "+2.4%", positive: true, sub: "Across all tracked vaults" },
            { label: "Liquid Reserves", value: "$124,400.00", trend: "Optimal", positive: true, sub: "Ready for deployment" },
            { label: "Monthly AI Yield", value: "+$14,250.00", trend: "+12.1%", positive: true, sub: "Generated via Auto-Sweep" },
            { label: "Volatility Exposure", value: "Low", trend: "-4.2%", positive: true, sub: "Market insulation active" }
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
        </div>

        {/* Main Grid: Left (Charts/Txns) + Right (Card/AI) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Span 2 */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Main Portfolio Chart */}
            <div className="glass-dark border border-white/5 rounded-3xl p-8 h-[400px] flex flex-col relative overflow-hidden group">
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
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  {/* Grid Lines */}
                  {[0, 10, 20, 30].map(y => (
                    <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.2" />
                  ))}
                  <path fill="url(#main-chart-grad)" d="M0 40 L0 30 Q 10 25, 20 28 T 40 20 T 60 15 T 80 5 T 100 8 L100 40 Z" />
                  <path fill="none" stroke="#D4AF37" strokeWidth="0.8" filter="url(#glow)" d="M0 30 Q 10 25, 20 28 T 40 20 T 60 15 T 80 5 T 100 8" />
                  {/* Current Position Marker */}
                  <circle cx="100" cy="8" r="1.5" fill="#D4AF37" className="animate-pulse" />
                  <circle cx="100" cy="8" r="3" fill="none" stroke="#D4AF37" strokeWidth="0.5" className="animate-ping opacity-50" />
                </svg>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="glass-dark border border-white/5 rounded-3xl p-8 flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-white text-xl font-bold">Ledger Feed</h2>
                <Link href="#" className="text-xs font-bold text-gold hover:text-white transition-colors uppercase tracking-widest">View All</Link>
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { name: "Sovereign AI Dividend", desc: "Automated Vault Sweep", amount: "+$3,420.00", type: "in", date: "Today, 09:12 AM" },
                  { name: "Apple Store - 5th Ave", desc: "MacBook Pro M4 Max", amount: "-$4,299.00", type: "out", date: "Yesterday, 14:30 PM" },
                  { name: "Geneva Capital Partners", desc: "SWIFT Transfer (CHF -> USD)", amount: "+$125,000.00", type: "in", date: "May 19, 11:00 AM" },
                  { name: "Equinox Hudson Yards", desc: "Destination Membership", amount: "-$350.00", type: "out", date: "May 18, 06:00 AM" },
                ].map((txn, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform ${txn.type === 'in' ? 'bg-emerald-500/10' : 'bg-white/5'}`}>
                        {txn.type === 'in' ? <ArrowDownRight className="w-5 h-5 text-emerald-400" /> : <ArrowUpRight className="w-5 h-5 text-gray-400" />}
                      </div>
                      <div>
                        <h4 className="text-white font-bold mb-1">{txn.name}</h4>
                        <p className="text-gray-500 text-xs">{txn.desc}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <h4 className={`font-bold tracking-tight mb-1 ${txn.type === 'in' ? 'text-emerald-400' : 'text-white'}`}>{txn.amount}</h4>
                      <p className="text-gray-600 text-xs">{txn.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column - Span 1 */}
          <div className="flex flex-col gap-8">

            {/* AI Directives */}
            <div className="border border-gold/30 rounded-3xl p-1 bg-gradient-to-b from-gold/10 to-transparent relative overflow-hidden group">
              <div className="absolute inset-0 bg-gold/5 blur-2xl group-hover:bg-gold/10 transition-colors" />
              <div className="glass-dark rounded-[22px] p-6 h-full relative z-10 border border-white/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center border border-gold/40">
                    <Sparkles className="w-4 h-4 text-gold animate-pulse" />
                  </div>
                  <h2 className="text-white font-bold text-lg">AI Directives</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-black/40 border border-gold/20 rounded-xl p-4">
                    <div className="flex gap-2 items-start mb-2">
                       <Zap className="w-4 h-4 text-gold mt-1 flex-shrink-0" />
                       <p className="text-sm text-gray-300 leading-relaxed">
                         Detected <span className="text-white font-bold">$42,000</span> idle cash in primary reserve. Recommend sweeping into Quantum Vault to secure an estimated <span className="text-emerald-400 font-bold">+$1,850</span> annual return.
                       </p>
                    </div>
                    <button className="w-full mt-3 py-2.5 rounded-lg bg-gold/10 hover:bg-gold/20 border border-gold/30 text-gold text-xs font-bold transition-colors">
                      Execute Auto-Sweep
                    </button>
                  </div>

                  <div className="bg-black/40 border border-white/10 rounded-xl p-4 opacity-70 hover:opacity-100 transition-opacity flex gap-3 items-center">
                     <ShieldCheck className="w-8 h-8 text-emerald-400 opacity-50" />
                     <p className="text-xs text-gray-400">All external accounts synced successfully. Security protocols holding at Tier 1.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Card */}
            <div className="glass-dark border border-white/5 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between group h-[280px]">
              <div className="flex justify-between items-center mb-4 z-10 relative">
                <h2 className="text-white font-bold">Active Card</h2>
                <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[10px] text-gray-300 uppercase tracking-widest font-bold">Live</span>
                </div>
              </div>

               {/* Pure CSS Credit Card (Scaled Down) */}
               <div className="w-full flex-1 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 p-5 flex flex-col justify-between relative shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-10 group-hover:scale-105 transition-transform duration-500">
                 <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-150%] animate-[shimmer_3s_infinite]" />
                 
                 <div className="flex justify-between items-start z-10 relative">
                   <div className="text-gold font-bold tracking-[0.2em] text-sm md:text-md">VAULTVISIO</div>
                   <svg width="30" height="18" viewBox="0 0 40 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M12.5 25C19.4036 25 25 19.4036 25 12.5C25 5.59644 19.4036 0 12.5 0C5.59644 0 0 5.59644 0 12.5C0 19.4036 5.59644 25 12.5 25Z" fill="#EB001B" />
                     <path d="M25 0H27.5V1.25H25V0Z" fill="#F79E1B" />
                     <path d="M27.5 25C34.4036 25 40 19.4036 40 12.5C40 5.59644 34.4036 0 27.5 0C25.5954 0 23.7915 0.425881 22.1706 1.1821C23.9576 4.31644 25 7.82855 25 12.5C25 17.1715 23.9576 20.6836 22.1706 23.8179C23.7915 24.5741 25.5954 25 27.5 25Z" fill="#F79E1B" />
                   </svg>
                 </div>
                 <div className="flex flex-col z-10 relative mt-4 md:mt-2">
                   <div className="w-8 h-6 bg-gradient-to-br from-[#FFD700] to-[#B8860B] rounded mb-2 opacity-80" />
                   <div className="text-white tracking-widest font-mono text-sm md:text-lg opacity-80">
                     **** **** **** 1337
                   </div>
                 </div>
               </div>

               <div className="flex items-center gap-2 mt-6 z-10 relative">
                 <button className="flex-1 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors">Details</button>
                 <button className="flex-1 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors">Freeze</button>
               </div>
            </div>

            {/* Quick Action */}
            <div className="glass-dark border border-white/5 rounded-3xl p-6">
              <h2 className="text-white font-bold mb-4">Quick Transfer</h2>
              <div className="bg-black/50 border border-white/10 rounded-xl flex items-center p-2 mb-4">
                <span className="text-gray-500 font-bold pl-3">$</span>
                <input type="number" placeholder="0.00" className="w-full bg-transparent text-white font-bold text-lg px-2 py-2 focus:outline-none placeholder-gray-700" />
                <button className="text-xs font-bold text-black bg-white rounded-lg px-4 py-2 hover:bg-gray-200 transition-colors">Max</button>
              </div>
              <button className="w-full py-3 rounded-xl bg-white hover:bg-gray-200 text-black font-bold flex items-center justify-center gap-2 transition-colors">
                 <Send className="w-4 h-4" /> Finalize Transfer
              </button>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
