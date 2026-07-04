import React, { useState } from 'react';
import { Bell, Search, Menu, X, CheckCircle, Wifi, Droplet, Sprout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const notifications = [
    {
      id: 1,
      title: 'Moisture Alert',
      desc: 'Zone 3 (Plot B) is below 35% soil moisture threshold.',
      time: '3m ago',
      type: 'warning',
      icon: Droplet,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    },
    {
      id: 2,
      title: 'Scan Finished',
      desc: 'Crop health scan of Zone 1 (Tomato Field) completed successfully.',
      time: '12m ago',
      type: 'success',
      icon: CheckCircle,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      id: 3,
      title: 'Weather Warning',
      desc: 'Sudden rain forecast in 4 hours. Recommend pausing automated irrigation.',
      time: '1h ago',
      type: 'info',
      icon: Sprout,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    }
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: '3d-map', label: '3D Telemetry' },
    { id: 'disease', label: 'Disease Scanner' },
    { id: 'assistant', label: 'AI Advisor' },
    { id: 'controls', label: 'Operations' },
  ];

  return (
    <header className="w-full h-16 sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between select-none">
      {/* Dynamic blurred background layer */}
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md border-b border-emerald-500/10 pointer-events-none" />
      
      {/* Left side: Brand/Mobile trigger */}
      <div className="flex items-center gap-3 relative z-10">
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="md:hidden p-2 rounded-lg bg-slate-900/60 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-950/20 transition-all"
        >
          {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        
        {/* Brand showing on mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <Sprout className="w-5 h-5 text-emerald-400" />
          <span className="font-bold text-md text-emerald-400">KrishiMitra</span>
        </div>

        {/* Status display (Desktop only) */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-950/30 border border-emerald-500/10 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
            <Wifi className="w-3 h-3" /> Krishi Core Online
          </span>
        </div>
      </div>

      {/* Center: Search (Desktop only) */}
      <div className="hidden md:block w-96 relative z-10">
        <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search crop models, operations, telemetry..."
          className="w-full pl-11 pr-4 py-2 text-sm glass-input text-slate-200"
        />
      </div>

      {/* Right side: Alerts & Profile */}
      <div className="flex items-center gap-4 relative z-10">
        {/* Notifications Icon */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-slate-900/60 border border-emerald-500/10 hover:border-emerald-500/30 text-slate-300 hover:text-emerald-400 transition-all relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]" />
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <>
                {/* Backdrop closer */}
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-80 glass-panel rounded-2xl p-4 z-50 overflow-hidden shadow-2xl flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between border-b border-emerald-500/10 pb-2">
                    <span className="font-semibold text-sm text-emerald-400">Notifications</span>
                    <button className="text-[10px] text-slate-400 hover:text-emerald-400 font-medium">Mark all read</button>
                  </div>

                  <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                    {notifications.map((n) => {
                      const Icon = n.icon;
                      return (
                        <div
                          key={n.id}
                          className="flex gap-3 p-2.5 rounded-xl bg-slate-950/30 hover:bg-slate-950/60 border border-emerald-500/5 transition-all text-left group"
                        >
                          <div className={`p-2 rounded-lg border flex items-center justify-center h-fit ${n.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <p className="text-xs font-semibold text-slate-200 truncate">{n.title}</p>
                              <span className="text-[9px] text-slate-500">{n.time}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-relaxed font-medium">{n.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-2.5 border-l border-emerald-500/10 pl-4">
          <div className="relative group cursor-pointer">
            {/* Avatar glow */}
            <div className="absolute inset-0 bg-emerald-500/25 rounded-full blur-sm group-hover:scale-110 transition-transform duration-300" />
            <div className="w-9 h-9 rounded-full bg-slate-900 border border-emerald-500/30 overflow-hidden relative flex items-center justify-center">
              <span className="font-semibold text-xs text-emerald-400">SM</span>
            </div>
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-200">Safal Mitra</span>
            <span className="text-[9px] text-emerald-400/70 font-semibold tracking-wider uppercase">FARM DIRECTOR</span>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 w-72 h-screen glass-panel z-50 p-6 flex flex-col gap-6 md:hidden"
            >
              <div className="flex items-center justify-between border-b border-emerald-500/10 pb-4">
                <div className="flex items-center gap-2">
                  <Sprout className="w-6 h-6 text-emerald-400" />
                  <span className="font-bold text-lg text-emerald-400">KrishiMitra</span>
                </div>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 rounded-lg bg-slate-900 border border-emerald-500/20 text-emerald-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-2">
                {menuItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setShowMobileMenu(false);
                      }}
                      className={`w-full px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-400'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              {/* Status and info bottom mobile */}
              <div className="mt-auto border-t border-emerald-500/10 pt-4 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <Wifi className="w-4 h-4" /> Connected to Core Node
                </div>
                <div className="text-[10px] text-slate-500">
                  Version 2.4.1 (Stable)<br />
                  Edge sensors: 12/12 online
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
