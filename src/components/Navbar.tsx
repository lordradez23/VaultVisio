"use client";

import { useState, useEffect } from "react";
import { Menu, X, Landmark, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "py-4 bg-black/60 backdrop-blur-xl border-b border-white/10" 
          : "py-6 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="relative">
            <Landmark className="w-8 h-8 text-gold transition-transform group-hover:scale-110" />
            <Cpu className="w-4 h-4 text-emerald-light absolute -bottom-1 -right-1 animate-pulse" />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-white">
            Vault<span className="text-gold">Visio</span>
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {["Wealth", "Vaults", "AI Analytics", "Security"].map((item) => {
            const getHref = (name: string) => {
              if (name === "AI Analytics") return "#analytics";
              return `#${name.toLowerCase()}`;
            };
            return (
              <a
                key={item}
                href={getHref(item)}
                className="text-sm font-medium text-gray-300 hover:text-gold transition-colors tracking-wide"
              >
                {item}
              </a>
            );
          })}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-white hover:text-gold transition-colors">
            Login
          </Link>
          <Link href="/register" className="bg-gold hover:bg-gold-dark text-black text-xs font-bold px-5 py-2.5 rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-[0_4px_15px_rgba(212,175,55,0.3)]">
            Open Account
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-2xl border-b border-white/10 md:hidden overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-6">
              {["Wealth", "Vaults", "AI Analytics", "Security"].map((item) => {
                const getHref = (name: string) => {
                  if (name === "AI Analytics") return "#analytics";
                  return `#${name.toLowerCase()}`;
                };
                return (
                  <a
                    key={item}
                    href={getHref(item)}
                    className="text-lg font-medium text-gray-300 hover:text-gold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                );
              })}
              <hr className="border-white/10" />
              <div className="flex flex-col gap-4">
                <Link href="/login" className="w-full py-3 text-center font-semibold text-white border border-white/20 rounded-xl hover:bg-white/5 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="w-full py-3 text-center font-bold bg-gold text-black rounded-xl hover:bg-gold-dark transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Open Account
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
