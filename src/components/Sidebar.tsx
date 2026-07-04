import React from 'react';
import { motion } from 'framer-motion';
import {
  Sprout,
  LayoutDashboard,
  Activity,
  ShieldAlert,
  MessageSquareCode,
  Sliders,
  CloudSun,
  Settings,
  HelpCircle,
  Cpu
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: '3d-map', label: '3D Telemetry', icon: Activity },
    { id: 'disease', label: 'Disease Scanner', icon: ShieldAlert },
    { id: 'weather', label: 'Weather Intel', icon: CloudSun },
    { id: 'assistant', label: 'AI Advisor', icon: MessageSquareCode },
    { id: 'controls', label: 'Operations', icon: Sliders },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 hidden md:flex flex-col z-20 p-4 select-none">
      <div className="w-full h-full glass-panel rounded-2xl flex flex-col justify-between p-4 overflow-hidden relative">
        {/* Background glow overlay */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col gap-8">
          {/* Logo / Header */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/30 rounded-lg blur-sm animate-pulse" />
              <div className="relative bg-gradient-to-br from-emerald-400 to-emerald-600 p-2 rounded-lg text-slate-950 flex items-center justify-center">
                <Sprout className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-wide bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                KrishiMitra
              </h1>
              <p className="text-xs text-emerald-400/50 font-medium">AI AGRI SUITE</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 relative text-left group overflow-hidden ${
                    isActive
                      ? 'text-emerald-400 font-semibold'
                      : 'text-slate-400 font-medium hover:text-emerald-300'
                  }`}
                >
                  {/* Hover background slide-in */}
                  <div
                    className={`absolute inset-0 bg-emerald-950/20 border-l-2 border-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      isActive ? 'opacity-100' : ''
                    }`}
                  />

                  {/* Active highlight background */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabGlow"
                      className="absolute inset-0 bg-gradient-to-r from-emerald-950/40 to-slate-900/10 border-l-2 border-emerald-400 z-0"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}

                  <span className="relative z-10 flex items-center justify-center">
                    <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-105 ${
                      isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-300'
                    }`} />
                  </span>
                  <span className="text-sm relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer/System Status */}
        <div className="flex flex-col gap-4">
          <div className="p-3 bg-slate-950/40 rounded-xl border border-emerald-500/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            
            <div className="flex items-center gap-2 mb-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-400/90 tracking-wider">AI SYSTEM STATUS</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              Soil & crop model syncing with edge sensors.
            </p>
            <div className="mt-2 text-[9px] font-mono text-emerald-500/60 flex justify-between">
              <span>LATENCY: 12ms</span>
              <span>VER: 2.4.1</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-2 text-slate-500 text-xs">
            <button className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            <button className="hover:text-emerald-400 transition-colors">
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
