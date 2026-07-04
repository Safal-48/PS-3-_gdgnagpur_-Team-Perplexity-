import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const FarmingAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello Safal! I am KrishiMitra AI. I have analyzed your 3D soil nodes and local weather telemetry. How can I help you optimize Zone 1 crops today?',
      timestamp: '15:45'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestionChips = [
    'How do I treat Tomato Late Blight?',
    'Optimal irrigation plan for Zone 3?',
    'What is the current NPK balance?',
    'Recommend next crop rotation'
  ];

  const responses: Record<string, string> = {
    'how do i treat tomato late blight?': 'Late Blight is severe. 1. Prune all infected brown leaves immediately. 2. Pause overhead sprinkler irrigation to keep leaves dry. 3. Apply an organic copper-based fungicide spray. Ensure Zone 1 soil is drained.',
    'optimal irrigation plan for zone 3?': 'Zone 3 (Plot B) is dry at 32% moisture. Since rain is forecast in 4 hours, I recommend scheduling a short 8-minute drip irrigation cycles rather than full cycles to conserve water and prevent soil erosion.',
    'what is the current npk balance?': 'NPK balances are stable (Nitrogen 78%, Phosphorus 64%, Potassium 88%). Excellent for current flowering stage. No additional nitrogen fertilizer is required this week to avoid excessive vine growth.',
    'recommend next crop rotation': 'After this Tomato harvest in Zone 1, I recommend planting Legumes (like peas or cover beans) to naturally replenish soil Nitrogen levels, improving structural soil organic content without artificial additives.'
  };

  const fallbackResponse = "I have queued that query into the agricultural knowledge base. Based on local sensors, soil temperature is stable at 22°C and Nitrogen is abundant. I recommend checking moisture levels in Zone 3 before triggering any changes.";

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response stream
    setTimeout(() => {
      const cleanText = text.toLowerCase().trim();
      let aiText = responses[cleanText] || fallbackResponse;
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setIsTyping(false);
      setMessages(prev => [...prev, aiMsg]);
    }, 1500);
  };

  return (
    <div className="glass-panel rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between h-[450px] select-none group">
      {/* Background glow overlay */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/15 transition-all duration-300" />
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-emerald-500/10 pb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/30 rounded-lg blur-sm" />
            <div className="relative bg-slate-900 border border-emerald-500/30 p-1.5 rounded-lg text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">KrishiMitra AI Advisor</h3>
            <p className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase">Conversational Co-Pilot</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 text-[9px] text-emerald-400 font-bold uppercase tracking-wider">
          LLM Online
        </div>
      </div>

      {/* Chat scroll section */}
      <div className="flex-1 overflow-y-auto my-3 pr-1 flex flex-col gap-3 relative z-10 max-h-[250px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[85%] ${
              msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
            }`}
          >
            <div
              className={`p-3 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-emerald-500 text-slate-950 font-semibold rounded-tr-none'
                  : 'bg-slate-900/80 border border-emerald-500/10 text-slate-200 rounded-tl-none font-medium'
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[8px] text-slate-500 mt-1 px-1 font-semibold">{msg.timestamp}</span>
          </div>
        ))}

        {isTyping && (
          <div className="self-start flex flex-col items-start max-w-[80%]">
            <div className="bg-slate-900/80 border border-emerald-500/10 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center justify-center">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestion Chips */}
      {messages.length === 1 && !isTyping && (
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none relative z-10">
          {suggestionChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="text-[9px] font-bold text-slate-300 hover:text-emerald-400 whitespace-nowrap px-2.5 py-1.5 rounded-lg border border-emerald-500/10 bg-slate-950/40 hover:border-emerald-500/30 transition-all shrink-0 cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Input box */}
      <div className="flex gap-2 relative z-10">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
          placeholder="Ask AI about irrigation, crop cycles, pests..."
          className="flex-1 px-4 py-2.5 text-xs glass-input text-slate-100"
        />
        <button
          onClick={() => handleSend(inputValue)}
          className="px-3.5 py-2.5 rounded-xl glass-button-primary text-slate-950 flex items-center justify-center cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
