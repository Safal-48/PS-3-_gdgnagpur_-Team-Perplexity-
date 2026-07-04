import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles } from 'lucide-react';

interface FloatingAIAssistantProps {
  onNavigateToAssistant: () => void;
}

export const FloatingAIAssistant: React.FC<FloatingAIAssistantProps> = ({ onNavigateToAssistant }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hey there! How can I help you optimize your crops today? 🌾' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      let aiText = "I've analyzed your real-time farm dashboard. Zone A's soil moisture is low (28%). I suggest watering or pruning tomatoes. For a deep consultation, click 'Open Full Advisor' below!";
      
      const lower = text.toLowerCase();
      if (lower.includes('weather') || lower.includes('rain')) {
        aiText = "Heavy rain is predicted at 20:00 tonight. I recommend pausing drip irrigation in all Zones to prevent over-saturation.";
      } else if (lower.includes('disease') || lower.includes('blight') || lower.includes('spot')) {
        aiText = "It looks like a possible Late Blight infection in Zone A. Prune brown leaves immediately and apply copper spray.";
      }

      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="w-80 h-[380px] mb-4 glass-panel rounded-2xl flex flex-col justify-between overflow-hidden shadow-2xl border border-emerald-500/20"
          >
            {/* Header */}
            <div className="p-3 bg-gradient-to-r from-emerald-950/60 to-slate-900/40 border-b border-emerald-500/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-4 h-4 text-slate-950" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-100 flex items-center gap-1">
                    KrishiMitra Lite <Sparkles className="w-3 h-3 text-emerald-400" />
                  </p>
                  <p className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider">Fast AI Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5 scrollbar-thin">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col max-w-[85%] ${
                    msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-emerald-500 text-slate-950 font-bold rounded-tr-none'
                        : 'bg-slate-900 border border-emerald-500/10 text-slate-200 rounded-tl-none font-medium'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="self-start flex gap-1 items-center p-2.5 bg-slate-900 border border-emerald-500/10 rounded-xl rounded-tl-none">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
            </div>

            {/* Footer with Input & Navigation */}
            <div className="p-3 border-t border-emerald-500/10 bg-slate-950/60 flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
                  placeholder="Ask about weather, disease, irrigation..."
                  className="flex-1 px-3 py-1.5 text-xs glass-input text-slate-100 placeholder-slate-500"
                />
                <button
                  onClick={() => handleSend(inputValue)}
                  className="p-1.5 rounded-lg glass-button-primary text-slate-950 flex items-center justify-center cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onNavigateToAssistant();
                }}
                className="w-full text-center text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 py-1.5 rounded-lg hover:bg-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                Open Full Advisor Mode <Sparkles className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 rounded-full shadow-2xl flex items-center justify-center relative cursor-pointer group"
      >
        <div className="absolute inset-0 bg-emerald-400 rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity animate-pulse" />
        <Bot className="w-6 h-6 z-10 text-slate-950" />
        {/* Unread badge/indicator */}
        <span className="absolute top-0 right-0 flex h-3.5 w-3.5 z-20">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500 text-[8px] font-black text-white flex items-center justify-center">1</span>
        </span>
      </motion.button>
    </div>
  );
};
