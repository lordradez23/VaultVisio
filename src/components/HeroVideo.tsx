"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure video plays reliably on all browsers
    if (videoRef.current) {
      videoRef.current.play().catch((err: unknown) => {
        console.warn("Autoplay prevented:", err);
      });
    }
    
    // Reduced motion fallback
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (prefersReducedMotion.matches && videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* AI-Generated Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] opacity-70"
        poster="/images/hero-fallback.png"
      >
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260503_144509_89e2d612-8af2-45c3-90f4-4831bc60715d.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* PREMIUM GRADIENT OVERLAYS */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/50 to-black z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0%,transparent_75%)] z-11 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(212,175,55,0.15)_0%,transparent_60%)] z-11 pointer-events-none" />

      {/* Foreground Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-white px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-6xl md:text-9xl font-bold tracking-tighter mb-6 leading-tight">
            Wealth, <br className="md:hidden" /> 
            <span 
              className="animate-shimmer"
              style={{ backgroundImage: 'linear-gradient(to right, #D4AF37, #F7E7CE, #D4AF37)' }}
            >Visualized.</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 drop-shadow-lg max-w-3xl mx-auto font-light leading-relaxed mb-12">
            Experience the fusion of <span className="text-gold font-medium">Artificial Intelligence</span> and 
            sovereign banking. Secure your future in the digital vault of tomorrow.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              href="/register"
              className="bg-gold hover:bg-gold-dark text-black text-lg font-bold px-10 py-4 rounded-2xl transition-all duration-300 shadow-[0_0_40px_rgba(212,175,55,0.3)] flex items-center gap-2 transform hover:scale-105 active:scale-95"
            >
              Start Your Journey <ArrowRight className="w-5 h-5" />
            </Link>
            <a 
              href="#wealth"
              className="glass px-10 py-4 rounded-2xl text-white text-lg font-semibold transition-all duration-300 hover:scale-105 hover:bg-white/10 active:scale-95"
            >
              Watch Intelligence
            </a>
          </div>
        </motion.div>
      </div>

      {/* Subtle Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold drop-shadow-md">Discover More</span>
        <div className="w-px h-12" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(212,175,55,0.5), transparent)' }} />
      </motion.div>
    </section>
  );
}
