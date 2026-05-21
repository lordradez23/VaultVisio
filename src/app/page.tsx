import Navbar from "@/components/Navbar";
import HeroVideo from "@/components/HeroVideo";
import { Shield, Brain, Zap, Globe } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      
      <main>
        <HeroVideo />

        {/* Features Section - Everyday Banking, Elevated */}
        <section id="analytics" className="py-24 px-6 bg-[#050505] relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald/5 blur-[120px] rounded-full" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-gold text-sm font-bold tracking-[0.3em] uppercase mb-4">Everyday Banking, Elevated</h2>
              <h3 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                Flawless Execution. <br /> Infinite Liquidity.
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Brain className="w-8 h-8 text-gold" />,
                  title: "Smart Accounts",
                  desc: "Checking and Savings accounts that automatically optimize your idle cash for highest yields."
                },
                {
                  icon: <Shield className="w-8 h-8 text-emerald-light" />,
                  title: "Quantum Security",
                  desc: "Beyond encryption. Multi-layer biometric and behavioral analysis secures every transaction."
                },
                {
                  icon: <Zap className="w-8 h-8 text-gold" />,
                  title: "Lightning Transfers",
                  desc: "Move assets across borders via SWIFT or instant blockchain rails in milliseconds with zero friction."
                },
                {
                  icon: <Globe className="w-8 h-8 text-white" />,
                  title: "Multi-Currency",
                  desc: "Hold, exchange, and spend over 50 prime currencies under real-time interbank rates."
                }
              ].map((feature, i) => (
                <div 
                  key={i}
                  className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-gold/30 transition-all duration-500 group cursor-default"
                >
                  <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit group-hover:scale-110 transition-transform duration-500">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-bold text-white mb-4">{feature.title}</h4>
                  <p className="text-gray-400 font-light leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-y border-white/5 bg-black">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap justify-between gap-12">
              {[
                { label: "Assets Managed", value: "$4.2B+" },
                { label: "Daily Transactions", value: "1.2M+" },
                { label: "Active Members", value: "850k" },
                { label: "Uptime Protocol", value: "99.99%" }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-4xl font-bold text-white mb-2">{stat.value}</span>
                  <span className="text-xs font-bold text-gold tracking-widest uppercase">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Elite Card Showcase */}
        <section id="security" className="py-32 bg-[#050505] overflow-hidden border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 relative flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-left z-10">
               <h2 className="text-gold text-sm font-bold tracking-[0.3em] uppercase mb-6">Elite Spending Power</h2>
               <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                 The Sovereign <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-white">Titanium Card.</span>
               </h3>
               <p className="text-gray-400 text-lg font-light leading-relaxed mb-8 max-w-md">
                 Forged from pure titanium and tailored to your global lifestyle. Enjoy limitless spending, automated expense categorization, and zero foreign transaction fees.
               </p>
               <ul className="space-y-4 mb-10 text-gray-300 font-light">
                 <li className="flex items-center gap-3"><Shield className="w-5 h-5 text-gold" /> Virtual cards for secure online checkouts</li>
                 <li className="flex items-center gap-3"><Zap className="w-5 h-5 text-gold" /> Instant freeze/unfreeze directly in-app</li>
                 <li className="flex items-center gap-3"><Globe className="w-5 h-5 text-gold" /> Universal acceptance in 150+ countries</li>
               </ul>
               <Link href="/register?tier=sovereign" className="inline-block px-8 py-4 rounded-xl bg-gold hover:bg-gold-dark text-black font-bold transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] text-center">
                 Apply For Sovereign
               </Link>
            </div>
            
            <div className="flex-1 relative w-full flex justify-center perspective-[1000px]">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gold/20 blur-[100px] rounded-full" />
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 blur-[80px] rounded-full" />
               
               {/* Pure CSS Credit Card */}
               <div className="w-[400px] h-[250px] rounded-2xl glass-dark border border-white/20 p-8 flex flex-col justify-between relative overflow-hidden transform lg:-rotate-y-[15deg] lg:rotate-x-[10deg] shadow-[20px_20px_50px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(255,255,255,0.1)] transition-transform duration-700 hover:rotate-y-0 hover:rotate-x-0 cursor-pointer">
                 <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-150%] animate-[shimmer_3s_infinite]" />
                 
                 <div className="flex justify-between items-start z-10">
                   <div className="text-gold font-bold tracking-[0.2em] text-xl">VAULTVISIO</div>
                   <svg width="40" height="25" viewBox="0 0 40 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M12.5 25C19.4036 25 25 19.4036 25 12.5C25 5.59644 19.4036 0 12.5 0C5.59644 0 0 5.59644 0 12.5C0 19.4036 5.59644 25 12.5 25Z" fill="#EB001B" />
                     <path d="M25 0H27.5V1.25H25V0Z" fill="#F79E1B" />
                     <path d="M27.5 25C34.4036 25 40 19.4036 40 12.5C40 5.59644 34.4036 0 27.5 0C25.5954 0 23.7915 0.425881 22.1706 1.1821C23.9576 4.31644 25 7.82855 25 12.5C25 17.1715 23.9576 20.6836 22.1706 23.8179C23.7915 24.5741 25.5954 25 27.5 25Z" fill="#F79E1B" />
                   </svg>
                 </div>
                 <div className="flex flex-col z-10">
                   <div className="w-12 h-9 bg-gradient-to-br from-[#FFD700] to-[#B8860B] rounded-md mb-4 opacity-80" />
                   <div className="text-white space-y-1 tracking-widest font-mono text-xl opacity-80">
                     <span>**** **** **** 1337</span>
                   </div>
                 </div>
                 <div className="flex justify-between items-end z-10 font-mono text-xs text-gray-400">
                   <div className="flex flex-col">
                     <span className="text-[8px] uppercase tracking-widest text-gold mb-1">Cardholder</span>
                     <span className="text-white tracking-widest">ALEXANDER W.</span>
                   </div>
                   <div className="flex flex-col">
                     <span className="text-[8px] uppercase tracking-widest text-gold mb-1">Valid Thru</span>
                     <span className="text-white tracking-widest">12/30</span>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* Wealth Dashboard Section */}
        <section id="wealth" className="py-32 px-6 bg-black relative">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 lg:order-2">
              <h2 className="text-gold text-sm font-bold tracking-[0.3em] uppercase mb-6">Wealth Management</h2>
              <h3 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
                Your Complete <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-[#F7E7CE]">Financial Picture.</span>
              </h3>
              <p className="text-gray-400 text-lg font-light leading-relaxed mb-10 max-w-xl">
                Track your net worth, analyze your cash flow, and review your investment performance in one elegant interface. Real-time connections to external accounts ensure you never miss a variable.
              </p>
              <Link href="/dashboard" className="inline-block px-8 py-4 rounded-xl border border-gold/40 text-gold font-bold hover:bg-gold/10 transition-all text-center">
                View Demo Dashboard
              </Link>
            </div>
            <div className="flex-1 w-full relative lg:order-1">
              <div className="absolute inset-0 bg-gold/10 blur-[100px] rounded-full" />
              <div className="glass-dark p-4 rounded-[2rem] relative z-10 border border-white/5 w-full h-80 flex flex-col gap-4 overflow-hidden">
                {/* Header Navbar */}
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10">
                  <div className="flex gap-2 items-center">
                    <div className="w-6 h-6 rounded-full bg-gold/80" />
                    <div className="w-24 h-4 rounded bg-white/20" />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/10" />
                    <div className="w-8 h-8 rounded-full bg-white/10" />
                  </div>
                </div>
                {/* Main Graph Area */}
                <div className="flex-1 flex gap-4">
                  <div className="flex-[2] bg-white/5 rounded-xl border border-white/10 p-4 flex flex-col justify-end relative overflow-hidden">
                    <div className="absolute top-4 left-4">
                      <div className="text-white/50 text-xs mb-1">Total Net Worth</div>
                      <div className="text-2xl text-white font-bold">$4,250,890</div>
                    </div>
                    {/* SVG Chart Line */}
                    <svg className="w-full h-24" viewBox="0 0 100 40" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path fill="url(#chart-grad)" d="M0 40 L0 30 Q 10 20, 20 25 T 40 15 T 60 20 T 80 5 T 100 10 L100 40 Z" />
                      <path fill="none" stroke="#D4AF37" strokeWidth="2" d="M0 30 Q 10 20, 20 25 T 40 15 T 60 20 T 80 5 T 100 10" />
                    </svg>
                  </div>
                  <div className="flex-1 flex flex-col gap-4 text-sm hidden sm:flex">
                    <div className="flex-1 bg-white/5 rounded-xl border border-white/10 p-3 flex flex-col justify-center">
                      <div className="text-white/50 text-xs">Monthly Flow</div>
                      <div className="text-emerald-400 font-bold">+$42,000</div>
                    </div>
                    <div className="flex-1 bg-white/5 rounded-xl border border-white/10 p-3 flex flex-col justify-center">
                      <div className="text-white/50 text-xs">AI Status</div>
                      <div className="text-gold font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gold animate-pulse" /> Optimal
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Account Tiers Section */}
        <section id="vaults" className="py-32 px-6 bg-[#030303] border-t border-white/5">
          <div className="max-w-7xl mx-auto text-center mb-20">
            <h2 className="text-gold text-sm font-bold tracking-[0.3em] uppercase mb-6">Designed For You</h2>
            <h3 className="text-4xl font-bold text-white tracking-tight">Account Tiers</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { name: "Essential", cost: "Free", color: "white" },
              { name: "Sovereign", cost: "$29/mo", color: "gold", featured: true },
              { name: "Infinite", cost: "Invite Only", color: "emerald-light" }
            ].map((tier, i) => (
              <div 
                key={i}
                className={`p-10 rounded-[2.5rem] border ${tier.featured ? 'border-gold bg-gold/5 scale-105 shadow-[0_0_50px_rgba(212,175,55,0.05)]' : 'border-white/10 bg-white/5'} transition-all flex flex-col h-full`}
              >
                <div>
                  <h4 className={`text-2xl font-bold text-${tier.color} mb-2`}>{tier.name}</h4>
                  <div className="text-4xl font-bold text-white mb-8">{tier.cost}</div>
                  <ul className="space-y-4 mb-10 text-gray-400 font-light">
                    {i === 0 && (
                      <>
                        <li>Standard Physical Card</li>
                        <li>Basic Checking & Savings</li>
                        <li>$5k Instant Transfers</li>
                        <li>0.5% FX Fee</li>
                      </>
                    )}
                    {i === 1 && (
                      <>
                        <li className="text-white font-medium">Titanium Metal Card</li>
                        <li>AI Wealth Insights</li>
                        <li>$100k Instant Transfers</li>
                        <li>0% FX Fee Worldwide</li>
                        <li>Priority Support</li>
                      </>
                    )}
                    {i === 2 && (
                      <>
                        <li className="text-white font-medium">Solid Gold Card Edition</li>
                        <li>Dedicated Private Banker</li>
                        <li>Unlimited Liquidity</li>
                        <li>Bespoke Concierge</li>
                        <li>Airport Lounge Access</li>
                      </>
                    )}
                  </ul>
                </div>
                <div className="mt-auto">
                  <Link href={`/register?tier=${tier.name.toLowerCase()}`} className={`block w-full py-4 text-center rounded-xl font-bold ${tier.featured ? 'bg-gold hover:bg-gold-dark text-black' : 'bg-white/5 hover:bg-white/10 text-white border border-white/20'}`}>
                    {tier.name === "Infinite" ? "Request Access" : "Open Account"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="py-20 px-6 bg-[#030303] border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 mb-16">
          <div className="max-w-xs">
            <h3 className="text-2xl font-bold tracking-tighter text-white mb-4">
              Vault<span className="text-gold">Visio</span>
            </h3>
            <p className="text-gray-500 text-sm font-light leading-relaxed">
              The premier artificial intelligence banking protocol. 
              Visualizing wealth and securing your future in the digital vault of tomorrow.
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-12 w-full md:w-auto">
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-2">Platform</h4>
              <Link href="/coming-soon" className="text-gray-400 hover:text-gold text-sm transition-colors">Smart Accounts</Link>
              <Link href="/coming-soon" className="text-gray-400 hover:text-gold text-sm transition-colors">Metal Cards</Link>
              <Link href="/coming-soon" className="text-gray-400 hover:text-gold text-sm transition-colors">Global Transfers</Link>
              <Link href="/coming-soon" className="text-gray-400 hover:text-gold text-sm transition-colors">Wealth AI</Link>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-2">Company</h4>
              <Link href="/coming-soon" className="text-gray-400 hover:text-gold text-sm transition-colors">About Us</Link>
              <Link href="/coming-soon" className="text-gray-400 hover:text-gold text-sm transition-colors">Careers</Link>
              <Link href="/coming-soon" className="text-gray-400 hover:text-gold text-sm transition-colors">Press</Link>
              <Link href="/coming-soon" className="text-gray-400 hover:text-gold text-sm transition-colors">Contact</Link>
            </div>
            <div className="flex flex-col gap-4 col-span-2 lg:col-span-1">
              <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-2">Legal</h4>
              <Link href="/coming-soon" className="text-gray-400 hover:text-gold text-sm transition-colors">Terms of Service</Link>
              <Link href="/coming-soon" className="text-gray-400 hover:text-gold text-sm transition-colors">Privacy Policy</Link>
              <Link href="/coming-soon" className="text-gray-400 hover:text-gold text-sm transition-colors">Regulatory Status</Link>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs font-medium max-w-2xl">
            © 2026 VaultVisio Systems Inc. All rights reserved. VaultVisio is a financial technology company, not a bank. 
            Banking services provided by Sovereign Partners Bank, Member FDIC.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all font-serif">
              𝕏
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all font-serif font-bold text-xs">
              in
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
