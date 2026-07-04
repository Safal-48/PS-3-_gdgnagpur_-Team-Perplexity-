import React, { useState } from 'react';
import { Droplet, Plane, RefreshCw, Zap } from 'lucide-react';

export const QuickActions: React.FC = () => {
  const [irrigationActive, setIrrigationActive] = useState(false);
  const [droneDeploying, setDroneDeploying] = useState(false);
  const [syncing, setSyncing] = useState(false);
  
  const handleIrrigation = () => {
    setIrrigationActive(!irrigationActive);
  };

  const handleDrone = () => {
    setDroneDeploying(true);
    setTimeout(() => {
      setDroneDeploying(false);
    }, 4000);
  };

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
    }, 2000);
  };

  return (
    <div className="glass-panel rounded-3xl p-5 relative overflow-hidden h-fit select-none group">
      {/* Background glow overlay */}
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-emerald-500/10 pb-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            Quick Actions Console
          </h3>
          <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Direct Farm Control</p>
        </div>
      </div>

      {/* Grid of Action buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Toggle Irrigation */}
        <button
          onClick={handleIrrigation}
          className={`flex flex-col items-center justify-between p-4 rounded-2xl border text-center transition-all duration-300 relative overflow-hidden group cursor-pointer ${
            irrigationActive 
              ? 'bg-emerald-950/40 border-emerald-400 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
              : 'bg-slate-950/20 border-emerald-500/10 text-slate-400 hover:border-emerald-500/30 hover:text-slate-200'
          }`}
        >
          <div className="absolute top-1 right-1 p-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${irrigationActive ? 'bg-emerald-400' : 'bg-transparent'}`}></span>
              <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${irrigationActive ? 'bg-emerald-500' : 'bg-slate-700'}`}></span>
            </span>
          </div>

          <Droplet className={`w-6 h-6 mb-2 ${irrigationActive ? 'text-emerald-400' : 'text-slate-400 group-hover:scale-105 transition-transform'}`} />
          <span className="text-xs font-bold whitespace-nowrap">Drip Irrigation</span>
          <span className="text-[8px] font-semibold text-slate-500 mt-1 uppercase tracking-wider">
            {irrigationActive ? 'Active (8m left)' : 'Paused'}
          </span>
        </button>

        {/* Deploy Diagnostic Drone */}
        <button
          onClick={handleDrone}
          disabled={droneDeploying}
          className={`flex flex-col items-center justify-between p-4 rounded-2xl border text-center transition-all duration-300 relative overflow-hidden group cursor-pointer ${
            droneDeploying
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)] animate-pulse'
              : 'bg-slate-950/20 border-emerald-500/10 text-slate-400 hover:border-emerald-500/30 hover:text-slate-200'
          }`}
        >
          <Plane className={`w-6 h-6 mb-2 ${droneDeploying ? 'text-amber-400 rotate-12' : 'text-slate-400 group-hover:scale-105 transition-transform'}`} />
          <span className="text-xs font-bold whitespace-nowrap">Launch Drone</span>
          <span className="text-[8px] font-semibold text-slate-500 mt-1 uppercase tracking-wider">
            {droneDeploying ? 'In Flight' : 'Ready to fly'}
          </span>
        </button>

        {/* Sensor Synchronizer */}
        <button
          onClick={handleSync}
          disabled={syncing}
          className={`flex flex-col items-center justify-between p-4 rounded-2xl border text-center transition-all duration-300 relative overflow-hidden group cursor-pointer ${
            syncing
              ? 'bg-blue-950/40 border-blue-500/40 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
              : 'bg-slate-950/20 border-emerald-500/10 text-slate-400 hover:border-emerald-500/30 hover:text-slate-200'
          }`}
        >
          <RefreshCw className={`w-6 h-6 mb-2 ${syncing ? 'text-blue-400 animate-spin' : 'text-slate-400 group-hover:scale-105 transition-transform'}`} />
          <span className="text-xs font-bold whitespace-nowrap">Sync Nodes</span>
          <span className="text-[8px] font-semibold text-slate-500 mt-1 uppercase tracking-wider">
            {syncing ? 'Connecting...' : 'Sync Now'}
          </span>
        </button>
      </div>
    </div>
  );
};
