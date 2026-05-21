'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Bot, User } from 'lucide-react';

interface QuickAction {
  label: string;
  query: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { label: "Analyze Liquidity", query: "Can you analyze my current liquid reserves for a $50k purchase?" },
  { label: "Check Yield", query: "What is my project monthly AI yield?" },
  { label: "Market Status", query: "What is the current status of the CHF/USD pair?" }
];

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Greeting, Sovereign. I am your Wealth Intelligence Concierge. How may I assist your portfolio today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInputValue('');
    setIsTyping(true);

    // Simulated AI Response logic
    setTimeout(() => {
      let response = "I'm analyzing your request against our current market directives...";
      if (text.toLowerCase().includes('liquidity')) {
        response = "Your liquid reserves are currently at $124,400. You have sufficient headroom for a $50k deployment while maintaining your Tier 1 safety margin.";
      } else if (text.toLowerCase().includes('yield')) {
        response = "Based on current Auto-Sweep velocity, your projected yield for this month is +$14,250, a 12.1% increase over the previous cycle.";
      }
      
      setMessages(prev => [...prev, { role: 'bot', content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gold shadow-[0_0_30px_rgba(212,175,55,0.4)] flex items-center justify-center z-[100] group"
      >
        <MessageSquare className="text-black w-6 h-6 group-hover:rotate-12 transition-transform" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-black animate-pulse" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className="fixed bottom-24 right-8 w-[400px] h-[600px] glass-dark border border-white/10 rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] z-[100] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center border border-gold/30">
                  <Sparkles className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Wealth Concierge</h3>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Autonomous Agent Active</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Chat Body */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}
                >
                  {msg.role === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                      <Bot className="w-4 h-4 text-gold" />
                    </div>
                  )}
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-gold/10 border border-gold/20 text-white rounded-tr-none' 
                      : 'bg-white/5 border border-white/5 text-gray-300 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex justify-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0 animate-pulse">
                    <Bot className="w-4 h-4 text-gold" />
                  </div>
                  <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-none flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
            </div>

            {/* Footer / Input */}
            <div className="p-6 bg-black/40 border-t border-white/5">
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {QUICK_ACTIONS.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(action.query)}
                    className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-400 hover:text-white hover:border-gold/30 transition-all"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
                  placeholder="Ask your concierge..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-gold/50 transition-colors"
                />
                <button 
                  onClick={() => handleSend(inputValue)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-gold flex items-center justify-center hover:bg-white transition-colors group"
                >
                  <Send className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
