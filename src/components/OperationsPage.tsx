import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Droplets,
  Zap,
  Thermometer,
  BarChart3,
  Activity,
  Leaf,
  Settings2,
  PlayCircle,
  PauseCircle,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Sprout,
  Wind,
  FlaskConical,
  CalendarDays,
  ChevronRight,
  Plus,
  Timer,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Zone {
  id: string;
  name: string;
  crop: string;
  area: string;
  status: 'active' | 'idle' | 'alert';
  moisture: number;
  health: number;
  irrigating: boolean;
  nextIrr: string;
  soilTemp: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

interface Task {
  id: string;
  title: string;
  zone: string;
  priority: 'high' | 'medium' | 'low';
  due: string;
  done: boolean;
  icon: React.ComponentType<any>;
}

interface FertilizerEvent {
  date: string;
  zone: string;
  product: string;
  amount: string;
  status: 'scheduled' | 'completed' | 'overdue';
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const INITIAL_ZONES: Zone[] = [
  { id: 'A', name: 'Zone A', crop: 'Tomato', area: '0.8 ha', status: 'alert', moisture: 28, health: 72, irrigating: false, nextIrr: '18:00 today', soilTemp: 24, nitrogen: 42, phosphorus: 65, potassium: 58 },
  { id: 'B', name: 'Zone B', crop: 'Tomato', area: '0.5 ha', status: 'active', moisture: 54, health: 94, irrigating: true, nextIrr: '06:00 tomorrow', soilTemp: 23, nitrogen: 78, phosphorus: 82, potassium: 74 },
  { id: 'C', name: 'Zone C', crop: 'Corn', area: '1.2 ha', status: 'active', moisture: 48, health: 88, irrigating: false, nextIrr: '20:00 today', soilTemp: 26, nitrogen: 55, phosphorus: 70, potassium: 62 },
  { id: 'D', name: 'Zone D', crop: 'Wheat', area: '0.9 ha', status: 'idle', moisture: 62, health: 91, irrigating: false, nextIrr: '08:00 tomorrow', soilTemp: 22, nitrogen: 88, phosphorus: 76, potassium: 80 },
];

const TASKS: Task[] = [
  { id: '1', title: 'Apply copper fungicide to Zone A', zone: 'Zone A', priority: 'high', due: 'Today 17:00', done: false, icon: FlaskConical },
  { id: '2', title: 'Inspect drip emitters — Row 3C', zone: 'Zone C', priority: 'high', due: 'Today 18:00', done: false, icon: Droplets },
  { id: '3', title: 'Record soil sample weights', zone: 'Zone B', priority: 'medium', due: 'Tomorrow 09:00', done: false, icon: FlaskConical },
  { id: '4', title: 'Prune tomato suckers in Zone A', zone: 'Zone A', priority: 'medium', due: 'Tomorrow 10:00', done: false, icon: Leaf },
  { id: '5', title: 'Check weather station battery', zone: 'All', priority: 'low', due: 'Jul 6', done: true, icon: Zap },
  { id: '6', title: 'Calibrate soil moisture sensor 2B', zone: 'Zone B', priority: 'low', due: 'Jul 7', done: true, icon: Activity },
];

const FERTILIZER_SCHEDULE: FertilizerEvent[] = [
  { date: 'Today', zone: 'Zone A', product: 'NPK 19-19-19', amount: '2.5 kg', status: 'overdue' },
  { date: 'Jul 6', zone: 'Zone B', product: 'Calcium Nitrate', amount: '1.8 kg', status: 'scheduled' },
  { date: 'Jul 7', zone: 'Zone C', product: 'Urea 46%', amount: '3.2 kg', status: 'scheduled' },
  { date: 'Jul 8', zone: 'Zone D', product: 'Potassium Sulphate', amount: '1.5 kg', status: 'scheduled' },
  { date: 'Jul 5', zone: 'Zone B', product: 'Micronutrient Mix', amount: '0.8 kg', status: 'completed' },
  { date: 'Jul 3', zone: 'Zone C', product: 'DAP Starter', amount: '4.0 kg', status: 'completed' },
];

const YIELD_DATA = [
  { month: 'Jan', actual: 18, target: 20 },
  { month: 'Feb', actual: 22, target: 20 },
  { month: 'Mar', actual: 19, target: 22 },
  { month: 'Apr', actual: 25, target: 22 },
  { month: 'May', actual: 23, target: 24 },
  { month: 'Jun', actual: 28, target: 24 },
  { month: 'Jul', actual: 24, target: 26 },
];

// ─── Mini Components ──────────────────────────────────────────────────────────

const NutrientBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between mb-1">
      <span className="text-[9px] text-slate-500 uppercase font-semibold tracking-wide">{label}</span>
      <span className="text-[9px] font-bold" style={{ color }}>{value}%</span>
    </div>
    <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </div>
  </div>
);

const StatusDot: React.FC<{ status: Zone['status'] }> = ({ status }) => {
  const classes = {
    active: 'bg-emerald-400',
    idle: 'bg-slate-500',
    alert: 'bg-rose-400 animate-pulse',
  };
  return (
    <span className={`inline-flex w-2 h-2 rounded-full ${classes[status]}`} />
  );
};

const PriorityBadge: React.FC<{ priority: Task['priority'] }> = ({ priority }) => {
  const styles = {
    high: 'bg-rose-500/15 text-rose-400 border-rose-500/25',
    medium: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
    low: 'bg-slate-700/50 text-slate-400 border-slate-600/25',
  };
  return (
    <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${styles[priority]}`}>
      {priority}
    </span>
  );
};

const FertStatusBadge: React.FC<{ status: FertilizerEvent['status'] }> = ({ status }) => {
  const styles = {
    scheduled: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
    completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    overdue: 'bg-rose-500/15 text-rose-400 border-rose-500/25',
  };
  const labels = { scheduled: 'Scheduled', completed: 'Done', overdue: 'Overdue' };
  return (
    <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

// Mini bar chart
const YieldChart: React.FC = () => {
  const maxVal = 30;
  return (
    <div className="flex items-end gap-2 h-20">
      {YIELD_DATA.map((d, i) => (
        <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex flex-col items-center gap-0.5 justify-end" style={{ height: 64 }}>
            {/* Target line (outline bar) */}
            <div className="relative w-full flex items-end justify-center" style={{ height: 64 }}>
              <motion.div
                className="absolute bottom-0 w-full rounded-t-sm bg-emerald-500/10 border border-emerald-500/20"
                initial={{ height: 0 }}
                animate={{ height: `${(d.target / maxVal) * 64}px` }}
                transition={{ duration: 0.8, delay: i * 0.06 }}
              />
              <motion.div
                className={`relative w-3/5 rounded-t-sm ${i === YIELD_DATA.length - 1 ? 'bg-gradient-to-t from-emerald-600 to-emerald-400' : 'bg-gradient-to-t from-emerald-700 to-emerald-500'}`}
                initial={{ height: 0 }}
                animate={{ height: `${(d.actual / maxVal) * 64}px` }}
                transition={{ duration: 0.8, delay: i * 0.06 + 0.1, ease: 'easeOut' }}
                style={{ boxShadow: i === YIELD_DATA.length - 1 ? '0 0 8px rgba(16,185,129,0.4)' : 'none' }}
              />
            </div>
          </div>
          <span className="text-[8px] text-slate-500 font-semibold">{d.month}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export const OperationsPage: React.FC = () => {
  const [zones, setZones] = useState<Zone[]>(INITIAL_ZONES);
  const [tasks, setTasks] = useState<Task[]>(TASKS);
  const [selectedZone, setSelectedZone] = useState<Zone>(INITIAL_ZONES[0]);
  const [activeTab, setActiveTab] = useState<'tasks' | 'fertilizer'>('tasks');

  const toggleIrrigation = (zoneId: string) => {
    setZones(prev =>
      prev.map(z => z.id === zoneId ? { ...z, irrigating: !z.irrigating, status: !z.irrigating ? 'active' : (z.moisture < 35 ? 'alert' : 'idle') } : z)
    );
    if (selectedZone.id === zoneId) {
      setSelectedZone(prev => ({ ...prev, irrigating: !prev.irrigating }));
    }
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const pendingTasks = tasks.filter(t => !t.done);
  const doneTasks = tasks.filter(t => t.done);

  const totalMoisture = Math.round(zones.reduce((s, z) => s + z.moisture, 0) / zones.length);
  const avgHealth = Math.round(zones.reduce((s, z) => s + z.health, 0) / zones.length);
  const irrigatingCount = zones.filter(z => z.irrigating).length;

  return (
    <div className="w-full flex flex-col gap-6 select-none">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="glass-panel rounded-3xl p-5 flex items-center justify-between relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <Settings2 className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Farm Operations Center</h2>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
              Irrigation control · Nutrient scheduling · Task management
            </p>
          </div>
        </div>
        {/* Summary pills */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
            <Activity className="w-3 h-3" />
            {irrigatingCount} Zones Irrigating
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-400 font-bold uppercase tracking-wider">
            <AlertTriangle className="w-3 h-3" />
            {pendingTasks.filter(t => t.priority === 'high').length} Urgent Tasks
          </div>
        </div>
      </div>

      {/* ── Quick Stat Row ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Avg Soil Moisture', value: `${totalMoisture}%`, sub: totalMoisture < 35 ? 'Below optimal' : 'Optimal range', icon: Droplets, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', trend: totalMoisture < 40 ? 'down' : 'up' },
          { label: 'Avg Crop Health', value: `${avgHealth}/100`, sub: 'Health index', icon: Sprout, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', trend: 'up' },
          { label: 'Pending Tasks', value: `${pendingTasks.length}`, sub: `${pendingTasks.filter(t => t.priority === 'high').length} urgent`, icon: CheckCircle, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', trend: 'down' },
          { label: 'Total Farm Area', value: '3.4 ha', sub: '4 active zones', icon: BarChart3, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', trend: 'up' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`glass-panel rounded-2xl p-4 border ${s.bg} relative overflow-hidden`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-xl bg-slate-900/60 ${s.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {s.trend === 'up'
                  ? <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  : <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                }
              </div>
              <p className="text-2xl font-black text-slate-100">{s.value}</p>
              <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wide mt-0.5">{s.label}</p>
              <p className="text-[9px] text-slate-400 mt-0.5">{s.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ── Zone Control Grid ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Zone selector + irrigation toggles */}
        <div className="flex flex-col gap-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Zone Control Panel</p>
          {zones.map((zone, i) => (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              onClick={() => setSelectedZone(zone)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedZone(zone)}
              className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                selectedZone.id === zone.id
                  ? 'bg-emerald-950/30 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.08)]'
                  : 'glass-panel border-emerald-500/5 hover:border-emerald-500/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <StatusDot status={zone.status} />
                  <span className="text-sm font-bold text-slate-100">{zone.name}</span>
                  <span className="text-[9px] text-slate-500 font-semibold">{zone.crop} · {zone.area}</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${selectedZone.id === zone.id ? 'text-emerald-400 rotate-90' : 'text-slate-600'}`} />
              </div>

              {/* Moisture mini bar */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${zone.moisture < 35 ? 'bg-rose-400' : zone.moisture < 50 ? 'bg-amber-400' : 'bg-blue-400'}`}
                    style={{ width: `${zone.moisture}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${zone.moisture}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
                <span className={`text-[9px] font-bold ${zone.moisture < 35 ? 'text-rose-400' : 'text-blue-400'}`}>{zone.moisture}%</span>
              </div>

              {/* Irrigation toggle */}
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-slate-400 font-semibold">
                  {zone.irrigating ? '💧 Irrigating now' : `Next: ${zone.nextIrr}`}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleIrrigation(zone.id); }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                    zone.irrigating
                      ? 'bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30'
                      : 'bg-slate-900/60 border-slate-700/40 text-slate-500 hover:border-emerald-500/30 hover:text-emerald-400'
                  }`}
                >
                  {zone.irrigating
                    ? <><PauseCircle className="w-3 h-3" /> Stop</>
                    : <><PlayCircle className="w-3 h-3" /> Start</>
                  }
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Zone detail panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedZone.id}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="glass-panel rounded-3xl p-6 relative overflow-hidden flex flex-col gap-5"
          >
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <StatusDot status={selectedZone.status} />
                  <h3 className="text-lg font-black text-slate-100">{selectedZone.name} — {selectedZone.crop}</h3>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold">{selectedZone.area} • Soil Temp: {selectedZone.soilTemp}°C</p>
              </div>
              <button
                onClick={() => toggleIrrigation(selectedZone.id)}
                className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                  selectedZone.irrigating
                    ? 'bg-blue-500/20 border-blue-500/30 text-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.2)]'
                    : 'glass-button-secondary text-slate-400 hover:text-emerald-400'
                }`}
              >
                {selectedZone.irrigating ? <PauseCircle className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
              </button>
            </div>

            {/* Health radial */}
            <div className="flex items-center gap-4 p-3 bg-slate-950/30 border border-emerald-500/8 rounded-2xl">
              <div className="relative w-16 h-16 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="26" className="stroke-slate-800" strokeWidth="6" fill="transparent" />
                  <motion.circle cx="32" cy="32" r="26"
                    stroke={selectedZone.health > 85 ? '#34d399' : selectedZone.health > 60 ? '#fbbf24' : '#f87171'}
                    strokeWidth="6" fill="transparent"
                    strokeDasharray={2 * Math.PI * 26}
                    initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 26 * (1 - selectedZone.health / 100) }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-sm font-black text-slate-100">{selectedZone.health}</p>
                  <p className="text-[8px] text-slate-400">/100</p>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-200">Crop Health Index</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {selectedZone.health > 85 ? '✅ Excellent — no intervention needed' : selectedZone.health > 60 ? '⚠️ Moderate — monitor closely' : '🚨 Low — immediate attention required'}
                </p>
              </div>
            </div>

            {/* NPK */}
            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Soil Nutrients (NPK)</p>
              <NutrientBar label="Nitrogen (N)" value={selectedZone.nitrogen} color="#34d399" />
              <NutrientBar label="Phosphorus (P)" value={selectedZone.phosphorus} color="#a78bfa" />
              <NutrientBar label="Potassium (K)" value={selectedZone.potassium} color="#fbbf24" />
            </div>

            {/* Sensor readings */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Droplets, label: 'Moisture', value: `${selectedZone.moisture}%`, color: 'text-blue-400' },
                { icon: Thermometer, label: 'Soil Temp', value: `${selectedZone.soilTemp}°C`, color: 'text-amber-400' },
                { icon: Wind, label: 'Next Irrig.', value: selectedZone.nextIrr, color: 'text-emerald-400' },
                { icon: Timer, label: 'Status', value: selectedZone.status.charAt(0).toUpperCase() + selectedZone.status.slice(1), color: selectedZone.status === 'alert' ? 'text-rose-400' : 'text-emerald-400' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="p-2.5 bg-slate-950/30 border border-emerald-500/5 rounded-xl flex gap-2 items-center">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${item.color}`} />
                    <div>
                      <p className="text-[8px] text-slate-500 font-semibold uppercase">{item.label}</p>
                      <p className="text-[11px] font-black text-slate-200">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Yield chart + analytics */}
        <div className="flex flex-col gap-4">
          <div className="glass-panel rounded-3xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Yield Performance</p>
                <p className="text-xs text-slate-500">Actual vs Target (tonnes/ha)</p>
              </div>
              <div className="flex items-center gap-3 text-[9px] font-semibold">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500 inline-block" />Actual</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500/20 border border-emerald-500/30 inline-block" />Target</span>
              </div>
            </div>
            <YieldChart />
            <div className="mt-4 p-3 bg-emerald-950/20 border border-emerald-500/10 rounded-xl">
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-slate-400 font-semibold">Season Average</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  <p className="text-xs font-black text-emerald-400">+14.2%</p>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Above target by 2.1 t/ha vs last season</p>
            </div>
          </div>

          {/* Water usage summary */}
          <div className="glass-panel rounded-3xl p-5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Water Usage (This Week)</p>
            {[
              { zone: 'Zone A', used: 420, max: 600, color: '#f87171' },
              { zone: 'Zone B', used: 310, max: 500, color: '#60a5fa' },
              { zone: 'Zone C', used: 550, max: 700, color: '#34d399' },
              { zone: 'Zone D', used: 180, max: 400, color: '#a78bfa' },
            ].map((w) => (
              <div key={w.zone} className="mb-3 last:mb-0">
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] text-slate-400 font-semibold">{w.zone}</span>
                  <span className="text-[10px] font-bold text-slate-300">{w.used}L / {w.max}L</span>
                </div>
                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: w.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(w.used / w.max) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tasks + Fertilizer Schedule ────────────────────────── */}
      <div className="glass-panel rounded-3xl p-5 relative overflow-hidden">
        <div className="absolute -top-6 right-12 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Tab switcher */}
        <div className="flex items-center gap-1 mb-5 p-1 bg-slate-950/40 border border-emerald-500/10 rounded-2xl w-fit">
          {[
            { id: 'tasks', label: 'Task Manager', icon: CheckCircle },
            { id: 'fertilizer', label: 'Fertilizer Schedule', icon: CalendarDays },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.1)]'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {tab.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'tasks' && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              {/* Pending column */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending ({pendingTasks.length})</p>
                  <button className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer">
                    <Plus className="w-3 h-3" /> Add Task
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {pendingTasks.map((task, i) => {
                    const Icon = task.icon;
                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-3 p-3 bg-slate-950/30 border border-emerald-500/5 hover:border-emerald-500/15 rounded-2xl group transition-all"
                      >
                        <button
                          onClick={() => toggleTask(task.id)}
                          className="w-4 h-4 mt-0.5 rounded border-2 border-slate-600 hover:border-emerald-500 transition-colors shrink-0 cursor-pointer group-hover:border-emerald-500/60"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-200 leading-snug">{task.title}</p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <PriorityBadge priority={task.priority} />
                            <span className="flex items-center gap-1 text-[9px] text-slate-500">
                              <Clock className="w-2.5 h-2.5" />{task.due}
                            </span>
                            <span className="text-[9px] text-emerald-500/60 font-semibold">{task.zone}</span>
                          </div>
                        </div>
                        <Icon className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-500/60 transition-colors shrink-0 mt-0.5" />
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Done column */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Completed ({doneTasks.length})</p>
                <div className="flex flex-col gap-2">
                  {doneTasks.map((task, i) => {
                    const Icon = task.icon;
                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-3 p-3 bg-slate-950/20 border border-emerald-500/5 rounded-2xl opacity-60"
                      >
                        <button
                          onClick={() => toggleTask(task.id)}
                          className="w-4 h-4 mt-0.5 rounded bg-emerald-500/30 border-2 border-emerald-500/50 flex items-center justify-center shrink-0 cursor-pointer"
                        >
                          <CheckCircle className="w-2.5 h-2.5 text-emerald-400" />
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-400 leading-snug line-through">{task.title}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[9px] text-slate-600 font-semibold">{task.zone}</span>
                          </div>
                        </div>
                        <Icon className="w-3.5 h-3.5 text-slate-700 shrink-0 mt-0.5" />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'fertilizer' && (
            <motion.div
              key="fertilizer"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {FERTILIZER_SCHEDULE.map((evt, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={`p-4 rounded-2xl border transition-all ${
                      evt.status === 'overdue'
                        ? 'bg-rose-950/10 border-rose-500/20'
                        : evt.status === 'completed'
                        ? 'bg-slate-950/20 border-emerald-500/8 opacity-60'
                        : 'bg-slate-950/20 border-blue-500/15'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FlaskConical className={`w-4 h-4 ${evt.status === 'overdue' ? 'text-rose-400' : evt.status === 'completed' ? 'text-emerald-400' : 'text-blue-400'}`} />
                        <span className="text-xs font-bold text-slate-200">{evt.product}</span>
                      </div>
                      <FertStatusBadge status={evt.status} />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <p className="text-[9px] text-slate-500 font-semibold uppercase">{evt.zone} · {evt.amount}</p>
                      </div>
                      <div className="flex items-center gap-1 text-[9px] text-slate-500">
                        <CalendarDays className="w-3 h-3" />
                        {evt.date}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
