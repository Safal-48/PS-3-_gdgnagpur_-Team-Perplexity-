import React from 'react';
import { CloudRain, Sun, CloudSun, Wind, Droplets, Compass } from 'lucide-react';

export const WeatherCard: React.FC = () => {
  const hourlyForecast = [
    { time: 'Now', temp: '24°', icon: CloudSun, active: true },
    { time: '16:00', temp: '25°', icon: Sun, active: false },
    { time: '17:00', temp: '23°', icon: CloudSun, active: false },
    { time: '18:00', temp: '21°', icon: CloudSun, active: false },
    { time: '19:00', temp: '19°', icon: CloudRain, active: false },
    { time: '20:00', temp: '18°', icon: CloudRain, active: false },
  ];

  return (
    <div className="glass-panel rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between h-fit min-h-[380px] select-none group">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/15 transition-all duration-300" />
      
      {/* Header */}
      <div className="flex items-center justify-between relative z-10 border-b border-emerald-500/10 pb-3">
        <div>
          <h3 className="text-md font-bold text-slate-100">Local Micro-Weather</h3>
          <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">PLOT STATION: ZONE 1</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
          Live Sync
        </div>
      </div>

      {/* Main Temperature Display */}
      <div className="my-5 flex items-center justify-between relative z-10">
        <div>
          <div className="flex items-start">
            <span className="text-5xl font-black text-white tracking-tighter">24</span>
            <span className="text-2xl font-bold text-emerald-400 mt-1">°C</span>
          </div>
          <p className="text-xs text-slate-300 font-semibold mt-1">Partly Cloudy • Humid</p>
          <p className="text-[10px] text-slate-400 font-medium">Feels like 26° • Wind WNW at 14 km/h</p>
        </div>
        <div className="relative">
          {/* Animated Glowing Ring behind Weather Icon */}
          <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-md animate-glow-pulse" />
          <div className="relative bg-slate-950/60 p-4 rounded-full border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <CloudSun className="w-12 h-12" />
          </div>
        </div>
      </div>

      {/* Secondary Weather Stats Grid */}
      <div className="grid grid-cols-3 gap-3 my-4 p-3 bg-slate-950/40 border border-emerald-500/5 rounded-2xl relative z-10">
        <div className="flex flex-col items-center justify-center text-center">
          <Droplets className="w-4 h-4 text-emerald-400 mb-1" />
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Humidity</span>
          <span className="text-xs font-bold text-slate-200 mt-0.5">72%</span>
        </div>
        <div className="flex flex-col items-center justify-center text-center border-x border-emerald-500/10">
          <Wind className="w-4 h-4 text-emerald-400 mb-1" />
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Precip</span>
          <span className="text-xs font-bold text-slate-200 mt-0.5">40%</span>
        </div>
        <div className="flex flex-col items-center justify-center text-center">
          <Compass className="w-4 h-4 text-emerald-400 mb-1" />
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Wind Dir</span>
          <span className="text-xs font-bold text-slate-200 mt-0.5">WNW</span>
        </div>
      </div>

      {/* Hourly forecast */}
      <div className="flex justify-between items-center my-3 gap-2 overflow-x-auto pb-1 relative z-10">
        {hourlyForecast.map((hour, idx) => {
          const Icon = hour.icon;
          return (
            <div
              key={idx}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border min-w-[50px] transition-all duration-300 ${
                hour.active
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-950/20 border-emerald-500/5 text-slate-400 hover:border-emerald-500/20'
              }`}
            >
              <span className="text-[9px] font-semibold">{hour.time}</span>
              <Icon className="w-4 h-4" />
              <span className="text-xs font-bold">{hour.temp}</span>
            </div>
          );
        })}
      </div>

      {/* Weather Advisory */}
      <div className="mt-2 p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-2xl relative z-10 flex gap-2.5 items-start">
        <div className="bg-emerald-500/20 p-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase shrink-0">
          Advisory
        </div>
        <div className="text-[10px] text-slate-300 leading-normal font-medium">
          Pausing automated irrigation planned at 18:00 due to upcoming 40% precipitation. Spray treatments should be completed by 17:00.
        </div>
      </div>
    </div>
  );
};
