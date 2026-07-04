import React from 'react';
import { Clock, CheckCircle, Info, ShieldAlert, Droplet } from 'lucide-react';

export const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: 1,
      title: 'Manual Irrigation Paused',
      desc: 'Director paused drip irrigation in Zone 1. Approaching storm advisory.',
      time: '15 mins ago',
      type: 'info',
      icon: Info,
      color: 'text-blue-400 border-blue-500/20 bg-blue-500/5'
    },
    {
      id: 2,
      title: 'Diagnostic Alert: Blight',
      desc: 'Camera node 4 flagged Tomato leaf blight risk (94% confidence) in Zone A.',
      time: '32 mins ago',
      type: 'warning',
      icon: ShieldAlert,
      color: 'text-rose-400 border-rose-500/20 bg-rose-500/5'
    },
    {
      id: 3,
      title: 'Irrigation Completed',
      desc: 'Zone 3 (Plot B) received 12L micro-sprinkler misting. Current moisture: 42.8%.',
      time: '1 hour ago',
      type: 'success',
      icon: Droplet,
      color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'
    },
    {
      id: 4,
      title: 'Node Calibration Synced',
      desc: 'Successfully updated configurations across 12 active soil telemetry devices.',
      time: '3 hours ago',
      type: 'success',
      icon: CheckCircle,
      color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'
    }
  ];

  return (
    <div className="glass-panel rounded-3xl p-5 relative overflow-hidden h-fit select-none group">
      {/* Background glow overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-emerald-500/10 pb-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            Recent Farm Log
          </h3>
          <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Live Activity Stream</p>
        </div>
      </div>

      {/* Timeline items */}
      <div className="flex flex-col gap-4 relative pl-3 border-l border-emerald-500/10 ml-2 py-1">
        {activities.map((act) => {
          const Icon = act.icon;
          return (
            <div key={act.id} className="relative flex gap-3 text-left">
              {/* Timeline circle overlay */}
              <div className="absolute -left-[20px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-950 border border-emerald-500/40" />
              
              <div className={`p-2 rounded-xl border flex items-center justify-center shrink-0 h-fit ${act.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-200 truncate">{act.title}</h4>
                  <span className="text-[9px] text-slate-500 font-semibold whitespace-nowrap">{act.time}</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed font-semibold mt-0.5">
                  {act.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
