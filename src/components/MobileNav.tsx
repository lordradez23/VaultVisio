'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ArrowRightLeft, CreditCard, Activity, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: 'Vault', href: '/dashboard' },
    { icon: ArrowRightLeft, label: 'Ledger', href: '/ledger' },
    { icon: CreditCard, label: 'Card', href: '#' },
    { icon: User, label: 'Profile', href: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full lg:hidden block z-[150] px-4 pb-4">
      <div className="glass-dark border border-white/10 rounded-2xl h-16 flex items-center justify-around px-2 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        {navItems.map((item, i) => {
          const isActive = pathname === item.href;
          return (
            <Link key={i} href={item.href} className="relative flex flex-col items-center justify-center w-12 h-12 group">
              {isActive && (
                <motion.div 
                   layoutId="mobileNavActive"
                   className="absolute inset-0 bg-gold/10 rounded-xl" 
                   transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <item.icon className={`w-5 h-5 mb-0.5 transition-colors ${isActive ? 'text-gold' : 'text-gray-500 group-hover:text-white'}`} />
              <span className={`text-[8px] font-bold uppercase tracking-widest ${isActive ? 'text-gold' : 'text-gray-600'}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
