import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Mic,
  MicOff,
  Sparkles,
  Bot,
  User,
  Trash2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  Leaf,
  Droplet,
  Sun,
  Bug,
  BarChart3,
  RotateCcw,
  BookOpen,
  Check,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  liked?: boolean | null;
  copied?: boolean;
}

interface SuggestedTopic {
  icon: React.ComponentType<any>;
  label: string;
  query: string;
  color: string;
}

const SUGGESTED_TOPICS: SuggestedTopic[] = [
  { icon: Bug, label: 'Disease Control', query: 'My tomato leaves have brown spots with yellow halos. What disease is this and how do I treat it organically?', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  { icon: Droplet, label: 'Irrigation Plan', query: 'Create an optimal drip irrigation schedule for Zone 3 corn crops during the monsoon season.', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { icon: Leaf, label: 'Crop Rotation', query: 'Recommend the best crop rotation plan after harvesting tomatoes in Zone A for maximum soil recovery.', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { icon: Sun, label: 'Soil Health', query: 'What does a soil pH of 5.8 mean for my tomato crops and how do I correct it naturally?', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { icon: BarChart3, label: 'Yield Forecast', query: 'Based on current sensor data showing 42% moisture and 94% crop health index, what is the expected yield for Zone 1 tomatoes?', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  { icon: BookOpen, label: 'Planting Guide', query: 'What are the best companion plants for tomatoes to naturally repel aphids and boost nitrogen?', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
];

const AI_RESPONSES: Record<string, string> = {
  default: "I've analyzed your farm telemetry data across all 12 active sensor nodes. Based on the current soil moisture (42.8%), solar intensity (680 W/m²), and the crop health index of 94.2, your Zone 1 crops are performing exceptionally well. Is there a specific aspect of your farm operations you'd like to optimize today?",
  disease: "🍃 **Tomato Late Blight Analysis**\n\nThe brown spots with yellow halos you're describing are classic symptoms of **Phytophthora infestans** (Late Blight). Here's your action plan:\n\n**Immediate Actions (24-48 hours):**\n• Prune all infected foliage and bag them (don't compost)\n• Apply **copper-based fungicide** spray to the entire canopy\n• Stop overhead irrigation — switch to drip at soil level\n\n**Medium-term (1-2 weeks):**\n• Monitor every 48 hours using your camera node\n• Increase plant spacing to improve airflow\n• Apply a preventive neem oil solution weekly\n\n**Prevention for next season:**\n• Use resistant varieties (Mountain Magic, Defiant)\n• Rotate with non-solanaceous crops\n\n⚠️ Severity: Medium. Act within 48 hours to prevent spread.",
  irrigation: "💧 **Zone 3 Corn Irrigation Schedule — Monsoon Season**\n\nGiven current soil moisture at 32% (below optimal 45-65% for corn) and upcoming 40% precipitation forecast:\n\n**This Week's Schedule:**\n• Monday 06:00 → 12 min drip cycle (Zone 3A)\n• Wednesday 06:00 → 8 min drip cycle (only if no rain Tuesday)\n• Friday → Skip if ≥8mm rainfall detected\n\n**Sensor Triggers:**\n• Auto-irrigate if soil moisture drops below 35%\n• Pause all irrigation if rainfall >10mm/hour\n\n**Water Conservation Tip:** Your current drip layout wastes ~18% water due to uneven emitter spacing. I recommend recalibrating emitters at 45cm intervals for corn row spacing.\n\n📊 Estimated water savings: 340L per week.",
  rotation: "🌿 **Post-Tomato Crop Rotation Plan — Zone A**\n\nAfter tomatoes, your soil in Zone A will be depleted of nitrogen and potentially harboring *Phytophthora* spores. Here's a 2-year recovery plan:\n\n**Year 1 (Immediate):**\n• Plant **Cover Crop Mix**: Crimson Clover + Field Peas (nitrogen-fixing)\n• This adds 80-120kg N/ha back to soil naturally\n\n**Year 2, Season 1:**\n• **Sweet Corn** — utilizes the restored nitrogen\n• Intercrop with **Beans** for continued fixation\n\n**Year 2, Season 2:**\n• **Brassicas** (Cabbage/Cauliflower) — breaks solanaceous disease cycles\n\n**Avoid returning to Solanaceae** (tomatoes, peppers, eggplant) for minimum 3 years in Zone A.\n\n✅ This rotation increases predicted yield by 23% over 3 seasons.",
  soil: "🧪 **Soil pH 5.8 Analysis for Tomatoes**\n\nTomatoes prefer **pH 6.0–6.8**. At 5.8, you're slightly acidic — here's the impact and fix:\n\n**Current Impact at pH 5.8:**\n• Phosphorus availability reduced by ~35%\n• Risk of manganese and aluminum toxicity\n• Slower nitrogen cycling by soil microbes\n\n**Natural Correction Methods:**\n\n1. **Agricultural Lime (Calcitic)**: Apply 500kg/acre to raise pH by 0.5 units\n   - Apply 6-8 weeks before planting\n   - Water in thoroughly after application\n\n2. **Wood Ash**: Rich in calcium and potassium — apply 100-200kg/acre\n\n3. **Oyster Shell Meal**: Slow-release calcium for gradual pH adjustment\n\n**Retest Recommendation:** Re-check soil pH in 6 weeks after treatment.\n\n📈 Expected yield improvement after correction: **15-20%**",
  yield: "📊 **Zone 1 Tomato Yield Forecast**\n\nBased on current sensor telemetry:\n- Soil Moisture: 42.8% ✅ (Optimal)\n- Crop Health Index: 94.2/100 ✅ (Excellent)\n- Solar Intensity: 680 W/m² ✅ (Good)\n\n**Yield Prediction:**\n\n| Variety | Plot Size | Est. Yield | Confidence |\n|---------|-----------|------------|------------|\n| Tomato (Zone A) | 0.8 ha | 22-26 tonnes | 87% |\n| Tomato (Zone B) | 0.5 ha | 14-17 tonnes | 82% |\n\n**Harvest Window:** 18-24 days from now based on current growth stage.\n\n**Risk Factors:**\n• Late Blight detected in Zone A (moderate risk)\n• Weather forecast shows rain in 4 hours — potential fungal pressure\n\n**Optimization Tip:** Treating the current blight outbreak and adjusting irrigation can increase yield confidence to **94%**.",
  companion: "🌱 **Companion Planting Guide for Tomatoes**\n\nStrategic companion planting can naturally repel aphids and boost your soil's nitrogen cycle:\n\n**Best Companions:**\n\n🌿 **Basil** (Plant 30cm from stems)\n• Repels aphids, spider mites, and thrips\n• Improves tomato flavor compounds\n• Plant 1 basil per 3 tomato plants\n\n💛 **Marigolds** (Border planting)\n• Releases limonene that deters aphids and whiteflies\n• Root secretions suppress nematodes\n• French variety (Tagetes patula) is most effective\n\n🫛 **Climbing Beans** (Trellis edge)\n• Fix atmospheric nitrogen (80-120 kg N/ha)\n• Provide shade reducing soil moisture loss\n\n❌ **Avoid near Tomatoes:**\n• Fennel, brassicas (allelopathic)\n• Corn (attracts shared pests)\n\n📍 **Zone A Specific Plan:** Plant marigold border rows along the north edge to block aphid entry from the field boundary."
};

function getAIResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('spot') || q.includes('blight') || q.includes('disease') || q.includes('brown')) return AI_RESPONSES.disease;
  if (q.includes('irrig') || q.includes('water') || q.includes('drip') || q.includes('moisture')) return AI_RESPONSES.irrigation;
  if (q.includes('rotat') || q.includes('after harvest') || q.includes('follow')) return AI_RESPONSES.rotation;
  if (q.includes('ph') || q.includes('soil') || q.includes('acid') || q.includes('lime')) return AI_RESPONSES.soil;
  if (q.includes('yield') || q.includes('harvest') || q.includes('forecast') || q.includes('tonnes')) return AI_RESPONSES.yield;
  if (q.includes('companion') || q.includes('basil') || q.includes('marigold') || q.includes('aphid')) return AI_RESPONSES.companion;
  return AI_RESPONSES.default;
}

// Typing animation component
const TypingIndicator: React.FC = () => (
  <div className="flex items-center gap-1.5 px-4 py-3">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-2 h-2 bg-emerald-400 rounded-full"
        animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
      />
    ))}
  </div>
);

// Render markdown-ish content
const MessageContent: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  return (
    <div className="flex flex-col gap-1 leading-relaxed text-sm">
      {lines.map((line, idx) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={idx} className="font-bold text-emerald-300">{line.slice(2, -2)}</p>;
        }
        if (line.startsWith('• ')) {
          return (
            <div key={idx} className="flex gap-2 items-start">
              <span className="text-emerald-400 mt-0.5 shrink-0">•</span>
              <span dangerouslySetInnerHTML={{
                __html: line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-300">$1</strong>')
              }} />
            </div>
          );
        }
        if (line.startsWith('🍃 ') || line.startsWith('💧 ') || line.startsWith('🌿 ') ||
          line.startsWith('🧪 ') || line.startsWith('📊 ') || line.startsWith('🌱 ')) {
          return <h3 key={idx} className="text-base font-bold text-slate-100 mt-1">{line}</h3>;
        }
        if (line.startsWith('⚠️') || line.startsWith('✅') || line.startsWith('📈') || line.startsWith('📍')) {
          return <p key={idx} className="text-xs text-slate-300 bg-slate-900/50 border border-emerald-500/10 rounded-lg px-3 py-1.5 mt-1">{line}</p>;
        }
        if (line.startsWith('| ')) {
          return (
            <div key={idx} className="overflow-x-auto">
              <table className="text-xs border-collapse w-full">
                <tbody>
                  <tr>
                    {line.split('|').filter(Boolean).map((cell, ci) => (
                      <td key={ci} className="border border-emerald-500/20 px-2 py-1 text-slate-300">{cell.trim()}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          );
        }
        if (line.trim() === '' || line.startsWith('|---')) return null;
        if (line.match(/^\d+\./)) {
          return (
            <div key={idx} className="flex gap-2 items-start">
              <span className="text-emerald-400 shrink-0 font-bold">{line.split('.')[0]}.</span>
              <span dangerouslySetInnerHTML={{
                __html: line.replace(/^\d+\.\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-300">$1</strong>')
              }} />
            </div>
          );
        }
        return (
          <p key={idx} dangerouslySetInnerHTML={{
            __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-300">$1</strong>')
          }} />
        );
      }).filter(Boolean)}
    </div>
  );
};

export const FarmingAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Namaste! 🌱 I'm **KrishiMitra AI** — your intelligent farm co-pilot.\n\nI've connected to your 12 active sensor nodes and analyzed Zone 1–3 telemetry. Your crops are performing well with a health index of **94.2/100**.\n\nHow can I help you optimize your farm today? You can ask me about diseases, irrigation, soil health, crop rotations, or anything else farming-related.",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showTopics, setShowTopics] = useState(true);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll chat
  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!isTyping) scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Scroll state detection
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    const onScroll = () => {
      const distFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
      setShowScrollBtn(distFromBottom > 100);
    };
    container.addEventListener('scroll', onScroll);
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  // Voice Recognition
  const startVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in this browser. Please use Chrome.');
      return;
    }
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-IN';

    recognitionRef.current.onresult = (e: any) => {
      const transcript = Array.from(e.results).map((r: any) => r[0].transcript).join('');
      setInput(transcript);
    };

    recognitionRef.current.onend = () => setIsListening(false);
    recognitionRef.current.onerror = () => setIsListening(false);

    recognitionRef.current.start();
    setIsListening(true);
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    setShowTopics(false);
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking delay
    const thinkTime = 1200 + Math.random() * 800;
    await new Promise(r => setTimeout(r, thinkTime));

    const responseText = getAIResponse(trimmed);
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseText,
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages(prev => [...prev, aiMsg]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleLike = (id: string, val: boolean) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, liked: m.liked === val ? null : val } : m));
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, copied: true } : m));
    setTimeout(() => setMessages(prev => prev.map(m => m.id === id ? { ...m, copied: false } : m)), 2000);
  };

  const clearChat = () => {
    setMessages([{
      id: '0',
      role: 'assistant',
      content: "Chat cleared. Ready for a fresh conversation! 🌱 How can I help with your farm today?",
      timestamp: new Date(),
    }]);
    setShowClearConfirm(false);
    setShowTopics(true);
  };

  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="w-full h-[calc(100vh-9rem)] flex flex-col gap-0 select-none">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-5 mb-4 flex items-center justify-between relative overflow-hidden shrink-0">
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3">
          {/* AI Avatar */}
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/30 rounded-2xl blur-md animate-pulse" />
            <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-slate-950" />
            </div>
            {/* Online indicator */}
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">KrishiMitra AI</h2>
            <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
              Agricultural Intelligence Co-pilot • Online
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sensor status badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            12 Nodes Active
          </div>
          
          {/* Clear Chat */}
          <div className="relative">
            <button
              onClick={() => setShowClearConfirm(!showClearConfirm)}
              className="p-2.5 rounded-xl glass-button-secondary text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {showClearConfirm && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 5 }}
                  className="absolute right-0 top-12 z-50 bg-slate-900 border border-rose-500/30 rounded-2xl p-4 min-w-[200px] shadow-2xl text-left"
                >
                  <p className="text-xs font-semibold text-slate-200 mb-3">Clear entire chat?</p>
                  <div className="flex gap-2">
                    <button onClick={clearChat} className="flex-1 px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-400 text-xs font-bold hover:bg-rose-500/30 transition-all cursor-pointer">Clear</button>
                    <button onClick={() => setShowClearConfirm(false)} className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-all cursor-pointer">Cancel</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Chat Area + Input — both in same glass container */}
      <div className="glass-panel rounded-3xl flex flex-col flex-1 min-h-0 relative overflow-hidden">
        {/* Ambient glow effects */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Messages scroll area */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 md:px-6 py-5 flex flex-col gap-5 relative z-10"
        >
          {/* Suggested topics banner */}
          <AnimatePresence>
            {showTopics && messages.length === 1 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-3 pb-2"
              >
                {SUGGESTED_TOPICS.map((topic, idx) => {
                  const Icon = topic.icon;
                  return (
                    <motion.button
                      key={topic.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      onClick={() => sendMessage(topic.query)}
                      className={`flex flex-col gap-2 p-3.5 rounded-2xl border text-left cursor-pointer transition-all duration-300 group hover:scale-[1.02] hover:shadow-lg ${topic.color}`}
                    >
                      <Icon className="w-4 h-4" />
                      <div>
                        <p className="text-xs font-bold text-slate-200">{topic.label}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{topic.query.substring(0, 60)}...</p>
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat messages */}
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* AI Avatar */}
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shrink-0 mt-1 shadow-lg shadow-emerald-500/20">
                  <Bot className="w-4 h-4 text-slate-950" />
                </div>
              )}

              <div className={`flex flex-col gap-1 max-w-[80%] md:max-w-[72%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {/* Bubble */}
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-slate-950 font-semibold rounded-tr-sm shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-900/80 border border-emerald-500/10 text-slate-200 rounded-tl-sm shadow-lg'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <MessageContent content={msg.content} />
                  ) : (
                    <p>{msg.content}</p>
                  )}
                </div>

                {/* Timestamp + Actions */}
                <div className={`flex items-center gap-2 px-1 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[9px] text-slate-500 font-semibold">{formatTime(msg.timestamp)}</span>
                  
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="p-1 rounded-md hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-all cursor-pointer"
                        title="Copy response"
                      >
                        {msg.copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                      <button
                        onClick={() => handleLike(msg.id, true)}
                        className={`p-1 rounded-md hover:bg-slate-800 transition-all cursor-pointer ${msg.liked === true ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleLike(msg.id, false)}
                        className={`p-1 rounded-md hover:bg-slate-800 transition-all cursor-pointer ${msg.liked === false ? 'text-rose-400' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* User Avatar */}
              {msg.role === 'user' && (
                <div className="w-8 h-8 bg-slate-800 border border-emerald-500/20 rounded-xl flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-emerald-400" />
                </div>
              )}
            </motion.div>
          ))}

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="flex gap-3 justify-start"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-slate-950" />
                </div>
                <div className="bg-slate-900/80 border border-emerald-500/10 rounded-2xl rounded-tl-sm shadow-lg">
                  <TypingIndicator />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={chatEndRef} />
        </div>

        {/* Scroll to bottom btn */}
        <AnimatePresence>
          {showScrollBtn && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToBottom}
              className="absolute bottom-24 right-6 z-20 p-2.5 rounded-full glass-button-secondary shadow-lg cursor-pointer border border-emerald-500/20"
            >
              <ChevronDown className="w-4 h-4 text-emerald-400" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Input area */}
        <div className="shrink-0 px-4 md:px-6 py-4 border-t border-emerald-500/10 relative z-10">
          {/* Quick re-suggest strip when chat has messages but topics hidden */}
          {!showTopics && messages.length > 1 && (
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-none">
              {SUGGESTED_TOPICS.slice(0, 4).map((topic) => {
                const Icon = topic.icon;
                return (
                  <button
                    key={topic.label}
                    onClick={() => sendMessage(topic.query)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/60 border border-emerald-500/10 text-[10px] font-semibold text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Icon className="w-3 h-3" />
                    {topic.label}
                  </button>
                );
              })}
              <button
                onClick={() => { setShowTopics(true); setMessages([{ id: '0', role: 'assistant', content: AI_RESPONSES.default, timestamp: new Date() }]); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/60 border border-emerald-500/10 text-[10px] font-semibold text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> More Topics
              </button>
            </div>
          )}

          <div className="flex gap-3 items-end">
            {/* Textarea */}
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? '🎤 Listening... speak your question' : 'Ask about irrigation, disease, soil health, crop rotations...'}
                rows={1}
                className={`w-full px-4 py-3 pr-14 text-sm glass-input text-slate-100 resize-none overflow-hidden transition-all duration-300 ${
                  isListening ? 'border-rose-500/60 bg-rose-950/10' : ''
                }`}
                style={{ minHeight: '48px', maxHeight: '120px' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                }}
                disabled={isTyping}
              />
              {/* Character count */}
              {input.length > 0 && (
                <span className="absolute bottom-2 right-3 text-[9px] text-slate-500 font-mono">
                  {input.length}
                </span>
              )}
            </div>

            {/* Voice button */}
            <button
              onClick={isListening ? stopVoice : startVoice}
              className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer shrink-0 ${
                isListening
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.2)]'
                  : 'glass-button-secondary text-slate-400 hover:text-emerald-400'
              }`}
              title={isListening ? 'Stop listening' : 'Voice input'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Send button */}
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className={`p-3 rounded-xl transition-all duration-300 cursor-pointer shrink-0 flex items-center justify-center ${
                input.trim() && !isTyping
                  ? 'glass-button-primary text-slate-950 shadow-lg shadow-emerald-500/10 hover:scale-105'
                  : 'bg-slate-900/50 border border-emerald-500/10 text-slate-600 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom info strip */}
          <div className="flex items-center justify-between mt-2.5 px-1">
            <p className="text-[9px] text-slate-500 font-semibold">
              Shift+Enter for new line • Enter to send
            </p>
            <div className="flex items-center gap-1 text-[9px] text-slate-500 font-semibold">
              <Sparkles className="w-2.5 h-2.5 text-emerald-500/50" />
              Powered by KrishiCore AI v1.8
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
