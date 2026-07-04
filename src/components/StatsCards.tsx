import React from 'react';
import { motion } from 'framer-motion';
import { Droplet, Sun, ShieldCheck, HeartPulse, Sprout } from 'lucide-react';

interface StatItemProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
  glowColor: string;
  children?: React.ReactNode;
}

const StatCard: React.FC<StatItemProps> = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  glowColor,
  children
}) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="glass-panel rounded-2xl p-5 relative overflow-hidden select-none flex flex-col justify-between h-48 cursor-pointer group"
    >
      {/* Background radial glow */}
      <div className={`absolute -right-8 -bottom-8 w-24 h-24 rounded-full blur-2xl opacity-15 transition-opacity duration-500 group-hover:opacity-30 ${glowColor}`} />
      
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-extrabold text-white mt-1.5 tracking-tight group-hover:text-emerald-300 transition-colors duration-300">
            {value}
          </h3>
        </div>
        <div className={`p-2.5 rounded-xl border border-emerald-500/10 bg-slate-950/30 text-emerald-400 flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="my-2 flex-grow flex items-center">
        {children}
      </div>

      <div className="flex items-center justify-between border-t border-emerald-500/5 pt-3">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          changeType === 'positive' 
            ? 'text-emerald-400 bg-emerald-500/10' 
            : changeType === 'negative' 
            ? 'text-rose-400 bg-rose-500/10' 
            : 'text-slate-400 bg-slate-500/10'
        }`}>
          {change}
        </span>
        <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">vs yesterday</span>
      </div>
    </motion.div>
  );
};

export const StatsCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
      {/* Soil Moisture */}
      <StatCard
        title="Soil Moisture"
        value="42.8%"
        change="+2.4% Optimal"
        changeType="positive"
        icon={Droplet}
        glowColor="bg-emerald-500"
      >
        <div className="w-full flex items-center gap-4">
          <div className="relative w-12 h-12 flex items-center justify-center">
            {/* SVG circular liquid progress */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                className="stroke-slate-800"
                strokeWidth="3.5"
                fill="transparent"
              />
              <motion.circle
                cx="24"
                cy="24"
                r="20"
                className="stroke-emerald-400"
                strokeWidth="3.5"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 20}
                initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 20 * (1 - 0.428) }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </svg>
            <span className="absolute text-[10px] font-bold text-emerald-400">42%</span>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Moisture level:</span>
              <span className="text-emerald-400 font-semibold">Active</span>
            </div>
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '42%' }}
                transition={{ duration: 1.2 }}
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" 
              />
            </div>
          </div>
        </div>
      </StatCard>

      {/* Solar Intensity */}
      <StatCard
        title="Solar Intensity"
        value="680 W/m²"
        change="-15W Moderate"
        changeType="neutral"
        icon={Sun}
        glowColor="bg-amber-500"
      >
        <div className="w-full h-10 flex items-end">
          {/* Micro sparkline */}
          <svg className="w-full h-full overflow-visible" viewBox="0 0 150 40">
            <defs>
              <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d="M 0,30 Q 15,10 30,25 T 60,15 T 90,35 T 120,10 T 150,20"
              fill="url(#sparklineGrad)"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
            {/* Sparkline glow point */}
            <motion.circle
              cx="150"
              cy="20"
              r="3"
              fill="#34d399"
              className="animate-ping"
            />
            <circle
              cx="150"
              cy="20"
              r="2"
              fill="#10b981"
            />
          </svg>
        </div>
      </StatCard>

      {/* Crop Health Index */}
      <StatCard
        title="Crop Health"
        value="94.2/100"
        change="+0.8% Excellent"
        changeType="positive"
        icon={HeartPulse}
        glowColor="bg-emerald-500"
      >
        <div className="w-full flex items-center gap-3">
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>Zone A (Tomato):</span>
              <span className="text-emerald-400 font-semibold">96%</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>Zone B (Corn):</span>
              <span className="text-emerald-400 font-semibold">92%</span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20 text-emerald-400 text-xs font-bold animate-pulse">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Optimal</span>
          </div>
        </div>
      </StatCard>

      {/* Nutrient Balance */}
      <StatCard
        title="Nutrients (NPK)"
        value="Balanced"
        change="Refilled 3d ago"
        changeType="neutral"
        icon={Sprout}
        glowColor="bg-blue-500"
      >
        <div className="w-full flex flex-col gap-2">
          {/* N Bar */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-slate-400 w-3">N</span>
            <div className="flex-1 h-1.5 bg-slate-900 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '78%' }}
                transition={{ duration: 1 }}
                className="h-full bg-emerald-500 rounded-full"
              />
            </div>
            <span className="text-[9px] font-semibold text-emerald-400 w-6 text-right">78%</span>
          </div>
          {/* P Bar */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-slate-400 w-3">P</span>
            <div className="flex-1 h-1.5 bg-slate-900 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '64%' }}
                transition={{ duration: 1, delay: 0.1 }}
                className="h-full bg-emerald-500 rounded-full"
              />
            </div>
            <span className="text-[9px] font-semibold text-emerald-400 w-6 text-right">64%</span>
          </div>
          {/* K Bar */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-slate-400 w-3">K</span>
            <div className="flex-1 h-1.5 bg-slate-900 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '88%' }}
                transition={{ duration: 1, delay: 0.2 }}
                className="h-full bg-emerald-400 rounded-full"
              />
            </div>
            <span className="text-[9px] font-semibold text-emerald-400 w-6 text-right">88%</span>
          </div>
        </div>
      </StatCard>
    </div>
  );
};
