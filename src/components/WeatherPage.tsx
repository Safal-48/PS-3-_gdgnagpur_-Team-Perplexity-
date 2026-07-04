import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wind,
  Droplets,
  Eye,
  Thermometer,
  Gauge,
  Leaf,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  MapPin,
  Clock,
  Sprout,
} from 'lucide-react';

// ─── Animated SVG Weather Icons ─────────────────────────────────────────────

const SunIcon: React.FC<{ size?: number }> = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className="drop-shadow-lg">
    <motion.circle cx="32" cy="32" r="14" fill="#fbbf24"
      animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
    {[0,45,90,135,180,225,270,315].map((deg, i) => (
      <motion.line key={i}
        x1={32 + 18 * Math.cos((deg * Math.PI) / 180)}
        y1={32 + 18 * Math.sin((deg * Math.PI) / 180)}
        x2={32 + 26 * Math.cos((deg * Math.PI) / 180)}
        y2={32 + 26 * Math.sin((deg * Math.PI) / 180)}
        stroke="#fcd34d" strokeWidth="3" strokeLinecap="round"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
      />
    ))}
  </svg>
);

const CloudSunIcon: React.FC<{ size?: number }> = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <motion.circle cx="42" cy="20" r="10" fill="#fbbf24"
      animate={{ x: [-2, 2, -2] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
    {[0,60,120,180,240,300].map((deg, i) => (
      <motion.line key={i}
        x1={42 + 13 * Math.cos((deg * Math.PI) / 180)}
        y1={20 + 13 * Math.sin((deg * Math.PI) / 180)}
        x2={42 + 18 * Math.cos((deg * Math.PI) / 180)}
        y2={20 + 18 * Math.sin((deg * Math.PI) / 180)}
        stroke="#fcd34d" strokeWidth="2.5" strokeLinecap="round"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, delay: i * 0.12 }}
      />
    ))}
    <motion.g animate={{ x: [-2, 2, -2] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
      <ellipse cx="24" cy="38" rx="14" ry="9" fill="#94a3b8" />
      <ellipse cx="32" cy="34" rx="10" ry="8" fill="#cbd5e1" />
      <ellipse cx="16" cy="38" rx="8" ry="7" fill="#cbd5e1" />
    </motion.g>
  </svg>
);

const CloudRainIcon: React.FC<{ size?: number }> = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <motion.g animate={{ x: [-3, 3, -3] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
      <ellipse cx="30" cy="26" rx="16" ry="10" fill="#64748b" />
      <ellipse cx="40" cy="22" rx="12" ry="9" fill="#94a3b8" />
      <ellipse cx="20" cy="28" rx="10" ry="8" fill="#94a3b8" />
    </motion.g>
    {[20,28,36,24,32].map((x, i) => (
      <motion.line key={i} x1={x} y1={42} x2={x - 4} y2={54}
        stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round"
        animate={{ opacity: [0, 1, 0], y: [0, 4, 8] }}
        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.22, ease: 'easeIn' }}
      />
    ))}
  </svg>
);

const CloudLightningIcon: React.FC<{ size?: number }> = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <motion.g animate={{ x: [-2, 2, -2] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
      <ellipse cx="30" cy="24" rx="16" ry="10" fill="#475569" />
      <ellipse cx="40" cy="20" rx="12" ry="9" fill="#64748b" />
      <ellipse cx="20" cy="26" rx="10" ry="8" fill="#64748b" />
    </motion.g>
    <motion.polygon points="30,36 24,48 30,45 26,58 38,42 31,45"
      fill="#fbbf24"
      animate={{ opacity: [0, 1, 0.6, 1, 0], scale: [0.9, 1, 0.95, 1, 0.9] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  </svg>
);

const FogIcon: React.FC<{ size?: number }> = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    {[18, 26, 34, 42].map((y, i) => (
      <motion.line key={i} x1={10} y1={y} x2={54} y2={y}
        stroke="#94a3b8" strokeWidth="3" strokeLinecap="round"
        animate={{ opacity: [0.2, 0.7, 0.2], x: [0, 4, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
      />
    ))}
  </svg>
);

const MoonClearIcon: React.FC<{ size?: number }> = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <motion.path d="M38 12 A18 18 0 1 1 12 38 A14 14 0 0 0 38 12Z"
      fill="#fcd34d"
      animate={{ scale: [1, 1.04, 1], opacity: [0.9, 1, 0.9] }}
      transition={{ duration: 4, repeat: Infinity }}
    />
    {[[48,12,2],[50,24,1.5],[42,8,1.5]].map(([cx,cy,r], i) => (
      <motion.circle key={i} cx={cx} cy={cy} r={r} fill="#fde68a"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
      />
    ))}
  </svg>
);

// ─── Types ────────────────────────────────────────────────────────────────────

type WeatherCondition = 'sunny' | 'partly-cloudy' | 'rainy' | 'thunderstorm' | 'foggy' | 'clear-night';

interface HourlyData { hour: string; temp: number; rain: number; icon: WeatherCondition; }
interface DayForecast { day: string; date: string; high: number; low: number; condition: WeatherCondition; label: string; rain: number; humidity: number; }
interface FarmingTip { icon: React.ComponentType<any>; color: string; title: string; desc: string; priority: 'urgent' | 'normal' | 'good'; }

// ─── Data ─────────────────────────────────────────────────────────────────────

const HOURLY: HourlyData[] = [
  { hour: 'Now', temp: 24, rain: 20, icon: 'partly-cloudy' },
  { hour: '17:00', temp: 26, rain: 10, icon: 'sunny' },
  { hour: '18:00', temp: 25, rain: 15, icon: 'partly-cloudy' },
  { hour: '19:00', temp: 23, rain: 40, icon: 'rainy' },
  { hour: '20:00', temp: 21, rain: 65, icon: 'rainy' },
  { hour: '21:00', temp: 20, rain: 75, icon: 'thunderstorm' },
  { hour: '22:00', temp: 19, rain: 55, icon: 'rainy' },
  { hour: '23:00', temp: 18, rain: 25, icon: 'partly-cloudy' },
];

const FORECAST: DayForecast[] = [
  { day: 'Today', date: 'Jul 4', high: 26, low: 18, condition: 'partly-cloudy', label: 'Partly Cloudy', rain: 40, humidity: 72 },
  { day: 'Saturday', date: 'Jul 5', high: 28, low: 20, condition: 'sunny', label: 'Clear Sunny', rain: 10, humidity: 55 },
  { day: 'Sunday', date: 'Jul 6', high: 27, low: 19, condition: 'partly-cloudy', label: 'Partly Cloudy', rain: 25, humidity: 63 },
  { day: 'Monday', date: 'Jul 7', high: 22, low: 16, condition: 'rainy', label: 'Heavy Rain', rain: 85, humidity: 88 },
  { day: 'Tuesday', date: 'Jul 8', high: 20, low: 14, condition: 'thunderstorm', label: 'Thunderstorms', rain: 90, humidity: 92 },
  { day: 'Wednesday', date: 'Jul 9', high: 21, low: 15, condition: 'rainy', label: 'Light Rain', rain: 60, humidity: 80 },
  { day: 'Thursday', date: 'Jul 10', high: 25, low: 17, condition: 'partly-cloudy', label: 'Clearing Up', rain: 20, humidity: 65 },
];

const FARMING_TIPS: FarmingTip[] = [
  {
    icon: AlertTriangle,
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    title: 'Pause Irrigation — Rain Expected Tonight',
    desc: 'Heavy rain (65–75%) forecast from 20:00–23:00. Suspend all drip and sprinkler schedules in Zone 1–3. Expected precipitation: 18–24mm.',
    priority: 'urgent',
  },
  {
    icon: Sprout,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    title: 'Complete Pesticide Spraying by 17:00',
    desc: 'Optimal spray window closes at 17:00 before wind picks up (projected 18 km/h). Apply copper fungicide to Zone A tomatoes now.',
    priority: 'urgent',
  },
  {
    icon: CheckCircle,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    title: 'Saturday: Perfect Transplanting Day',
    desc: 'Saturday forecast shows 28°C with low humidity (55%) and minimal wind — ideal conditions for seedling transplantation.',
    priority: 'good',
  },
  {
    icon: Leaf,
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    title: 'Fungal Risk Alert: Mon–Tue',
    desc: 'Extended wet period (Mon–Tue) with 85–90% rain probability creates high Late Blight pressure. Prepare preventive fungicide.',
    priority: 'normal',
  },
];

// ─── Helper: Weather Icon Renderer ───────────────────────────────────────────

const WeatherIcon: React.FC<{ condition: WeatherCondition; size?: number }> = ({ condition, size = 40 }) => {
  switch (condition) {
    case 'sunny': return <SunIcon size={size} />;
    case 'partly-cloudy': return <CloudSunIcon size={size} />;
    case 'rainy': return <CloudRainIcon size={size} />;
    case 'thunderstorm': return <CloudLightningIcon size={size} />;
    case 'foggy': return <FogIcon size={size} />;
    case 'clear-night': return <MoonClearIcon size={size} />;
    default: return <SunIcon size={size} />;
  }
};

// ─── Animated Radial Progress ─────────────────────────────────────────────────

const RadialGauge: React.FC<{ value: number; max: number; color: string; label: string; unit: string }> = ({
  value, max, color, label, unit
}) => {
  const pct = value / max;
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={r} className="stroke-slate-800" strokeWidth="5" fill="transparent" />
          <motion.circle cx="32" cy="32" r={r} stroke={color} strokeWidth="5" fill="transparent"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - dash }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute text-center">
          <p className="text-xs font-bold text-slate-100 leading-none">{value}</p>
          <p className="text-[8px] text-slate-400 leading-none mt-0.5">{unit}</p>
        </div>
      </div>
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
    </div>
  );
};

// ─── Rain Bar ─────────────────────────────────────────────────────────────────

const RainBar: React.FC<{ pct: number; color?: string }> = ({ pct, color = '#60a5fa' }) => (
  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
    <motion.div
      className="h-full rounded-full"
      style={{ backgroundColor: color }}
      initial={{ width: 0 }}
      animate={{ width: `${pct}%` }}
      transition={{ duration: 1, ease: 'easeOut' }}
    />
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  wind: number;
  pressure: number;
  uvIndex: number;
  rainProb: number;
  hourly: HourlyData[];
  advisories: { title: string; desc: string; priority: 'urgent' | 'normal' | 'good' }[];
}

export const WeatherPage: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [spinning, setSpinning] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // Geolocation states
  const [permission, setPermission] = useState<'prompt' | 'granted' | 'default' | 'loading'>('prompt');
  const [lat, setLat] = useState<number>(28.6);
  const [lon, setLon] = useState<number>(77.2);
  const [locError, setLocError] = useState<string | null>(null);

  const fetchWeather = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      console.error('Weather API fetch failed:', err);
    }
  };

  const handleRequestGPS = () => {
    setPermission('loading');
    setLocError(null);
    if (!navigator.geolocation) {
      setLocError('Geolocation is not supported by your browser.');
      setPermission('default');
      fetchWeather(28.6, 77.2);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = parseFloat(position.coords.latitude.toFixed(4));
        const longitude = parseFloat(position.coords.longitude.toFixed(4));
        setLat(latitude);
        setLon(longitude);
        setPermission('granted');
        fetchWeather(latitude, longitude);
      },
      (error) => {
        console.warn('Geolocation access failed:', error);
        setLocError('Location permission denied or timed out. Falling back to default coordinates.');
        setPermission('default');
        fetchWeather(28.6, 77.2);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleUseDefault = () => {
    setLat(28.6);
    setLon(77.2);
    setPermission('default');
    fetchWeather(28.6, 77.2);
  };

  const handleRefresh = async () => {
    setSpinning(true);
    await fetchWeather(lat, lon);
    setLastRefresh(new Date());
    setSpinning(false);
  };

  const activeTemp = weather ? weather.temp : 24;
  const activeCondition = weather ? weather.condition : 'Partly Cloudy';
  const activeHumidity = weather ? weather.humidity : 72;
  const activeWind = weather ? weather.wind : 14;
  const activePressure = weather ? weather.pressure : 1013;
  const activeUvIndex = weather ? weather.uvIndex : 8;
  const activeRainProb = weather ? weather.rainProb : 40;
  const activeHourly = weather ? weather.hourly : HOURLY;
  const activeAdvisories = weather ? weather.advisories : [
    { title: 'Pause Irrigation — Rain Expected Tonight', desc: 'Heavy rain (65–75%) forecast from 20:00–23:00. Suspend all drip and sprinkler schedules in Zone 1–3. Expected precipitation: 18–24mm.', priority: 'urgent' },
    { title: 'Complete Pesticide Spraying by 17:00', desc: 'Optimal spray window closes at 17:00 before wind picks up (projected 18 km/h). Apply copper fungicide to Zone A tomatoes now.', priority: 'urgent' }
  ];

  const day = FORECAST[selectedDay];

  if (permission === 'prompt' || permission === 'loading') {
    return (
      <div className="w-full min-h-[500px] flex items-center justify-center p-4 select-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="glass-panel max-w-md w-full rounded-3xl p-8 text-center relative overflow-hidden border border-emerald-500/10"
        >
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex justify-center mb-6">
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse"
              />
              <div className="relative p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <MapPin className="w-12 h-12" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-black text-slate-100 mb-3 tracking-tight">
            Enable Plot GPS Tracking
          </h2>
          
          <p className="text-xs text-slate-400 leading-relaxed font-medium mb-6">
            KrishiCore requires access to your plot's exact coordinates to fetch real-time localized weather data, calculate dew points, and generate custom AI spray advisories.
          </p>

          {locError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-left"
            >
              <div className="flex gap-2 text-[10px] text-amber-300 font-semibold leading-relaxed">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{locError}</span>
              </div>
            </motion.div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={handleRequestGPS}
              disabled={permission === 'loading'}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-slate-950 font-bold text-xs tracking-wide transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {permission === 'loading' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Detecting Location...</span>
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4" />
                  <span>Detect GPS Location</span>
                </>
              )}
            </button>

            <button
              onClick={handleUseDefault}
              disabled={permission === 'loading'}
              className="w-full py-3.5 rounded-2xl bg-slate-950/40 hover:bg-slate-950/60 active:scale-[0.98] border border-slate-800 text-slate-300 hover:text-slate-100 font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>Use Default Coordinates</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 select-none">

      {/* ── Page Header ───────────────────────────────────────── */}
      <div className="glass-panel rounded-3xl p-5 flex items-center justify-between relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <SunIcon size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Weather Intelligence</h2>
            <div className="flex items-center gap-3 mt-0.5">
              <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                {permission === 'granted'
                  ? `Plot Location (${lat}°N, ${lon}°E)`
                  : `Zone 1 — Default Station (${lat}°N, ${lon}°E)`}
              </p>
              <button
                onClick={() => setPermission('prompt')}
                className="text-[9px] text-emerald-400 hover:underline cursor-pointer font-bold ml-1"
              >
                Change Location
              </button>
              <span className="text-slate-700">·</span>
              <p className="text-[10px] text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Updated {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2.5 rounded-xl glass-button-secondary text-emerald-400 hover:scale-110 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${spinning ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* ── Current Conditions Hero + Gauges ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* HERO Current Weather */}
        <div className="lg:col-span-1 glass-panel rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[280px]">
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Weather</p>
              <div className="flex items-start gap-1">
                <span className="text-7xl font-black text-white tracking-tighter leading-none">{activeTemp}</span>
                <span className="text-3xl font-bold text-emerald-400 mt-2">°C</span>
              </div>
              <p className="text-sm font-semibold text-slate-300 mt-1">{activeCondition}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Feels like {activeTemp + 2}°C</p>
            </div>
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <WeatherIcon condition={activeCondition.toLowerCase().replace(' ', '-') as any} size={72} />
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="p-2.5 bg-slate-950/40 rounded-xl border border-emerald-500/5 flex items-center gap-2">
              <ArrowUp className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <div>
                <p className="text-[9px] text-slate-500 uppercase font-semibold">High</p>
                <p className="text-xs font-bold text-slate-200">{activeTemp + 2}°C</p>
              </div>
            </div>
            <div className="p-2.5 bg-slate-950/40 rounded-xl border border-emerald-500/5 flex items-center gap-2">
              <ArrowDown className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <div>
                <p className="text-[9px] text-slate-500 uppercase font-semibold">Low</p>
                <p className="text-xs font-bold text-slate-200">{activeTemp - 6}°C</p>
              </div>
            </div>
          </div>

          {/* Rain probability bar */}
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Rain Probability</p>
              <p className="text-xs font-black text-blue-300">{activeRainProb}%</p>
            </div>
            <RainBar pct={activeRainProb} color="#60a5fa" />
            <p className="text-[10px] text-slate-400 mt-1.5">{activeRainProb > 50 ? 'Precipitation expected soon' : 'Precipitation unlikely'}</p>
          </div>
        </div>

        {/* Metrics gauges + secondary stats */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Four radial gauges */}
          <div className="glass-panel rounded-3xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <RadialGauge value={activeHumidity} max={100} color="#60a5fa" label="Humidity" unit="%" />
            <RadialGauge value={activeWind} max={60} color="#34d399" label="Wind" unit="km/h" />
            <RadialGauge value={activePressure} max={1040} color="#a78bfa" label="Pressure" unit="hPa" />
            <RadialGauge value={activeUvIndex} max={10} color="#fbbf24" label="UV Index" unit="/10" />
          </div>

          {/* Detailed metrics strip */}
          <div className="glass-panel rounded-3xl p-5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">Live Sensor Readings</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: Droplets, label: 'Relative Humidity', value: `${activeHumidity}%`, sub: activeHumidity > 65 ? 'High humidity' : 'Optimal range', color: 'text-blue-400' },
                { icon: Wind, label: 'Wind Speed', value: `${activeWind} km/h`, sub: 'Direction: WNW', color: 'text-emerald-400' },
                { icon: Eye, label: 'Visibility', value: '9.2 km', sub: 'Clear view', color: 'text-slate-300' },
                { icon: Gauge, label: 'Pressure', value: `${activePressure} hPa`, sub: 'Stable', color: 'text-purple-400' },
                { icon: Thermometer, label: 'Dew Point', value: `${activeTemp - 4}°C`, sub: 'Moderate moisture', color: 'text-amber-400' },
                { icon: Droplets, label: 'Precipitation', value: '0mm', sub: 'Last 24 hours', color: 'text-cyan-400' },
              ].map((metric) => {
                const Icon = metric.icon;
                return (
                  <motion.div
                    key={metric.label}
                    whileHover={{ scale: 1.02 }}
                    className="flex gap-2.5 items-center p-3 bg-slate-950/30 border border-emerald-500/5 rounded-2xl group hover:border-emerald-500/20 transition-all"
                  >
                    <div className={`p-2 rounded-xl bg-slate-900/60 ${metric.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wide">{metric.label}</p>
                      <p className="text-sm font-black text-slate-100">{metric.value}</p>
                      <p className="text-[9px] text-slate-500 font-medium">{metric.sub}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Hourly Forecast ───────────────────────────────────── */}
      <div className="glass-panel rounded-3xl p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">Hourly Forecast</p>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {activeHourly.map((h, i) => (
            <motion.div
              key={h.hour}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border shrink-0 min-w-[80px] transition-all duration-300 ${
                h.hour === 'Now'
                  ? 'bg-emerald-950/40 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.08)]'
                  : 'bg-slate-950/20 border-emerald-500/5 hover:border-emerald-500/20'
              }`}
            >
              <p className={`text-[10px] font-bold uppercase tracking-wider ${h.hour === 'Now' ? 'text-emerald-400' : 'text-slate-500'}`}>{h.hour}</p>
              <motion.div animate={{ y: [-2, 2, -2] }} transition={{ duration: 3 + i * 0.3, repeat: Infinity }}>
                <WeatherIcon condition={h.icon} size={32} />
              </motion.div>
              <p className="text-sm font-black text-slate-100">{h.temp}°</p>
              <div className="flex items-center gap-1">
                <Droplets className="w-2.5 h-2.5 text-blue-400" />
                <p className="text-[9px] font-semibold text-blue-400">{h.rain}%</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── 7-Day Forecast + Detail Panel ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 7-day list */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-5 relative overflow-hidden">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">7-Day Forecast</p>
          <div className="flex flex-col gap-2">
            {FORECAST.map((fc, i) => (
              <motion.button
                key={fc.day}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => setSelectedDay(i)}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all duration-300 text-left w-full cursor-pointer ${
                  selectedDay === i
                    ? 'bg-emerald-950/40 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.08)]'
                    : 'bg-slate-950/10 border-emerald-500/5 hover:border-emerald-500/20 hover:bg-slate-950/30'
                }`}
              >
                <div className="w-20 shrink-0">
                  <p className={`text-xs font-bold ${selectedDay === i ? 'text-emerald-400' : 'text-slate-300'}`}>{fc.day}</p>
                  <p className="text-[9px] text-slate-500">{fc.date}</p>
                </div>

                <div className="w-9 shrink-0">
                  <WeatherIcon condition={fc.condition} size={36} />
                </div>

                <p className="text-[10px] text-slate-400 flex-1 font-medium hidden sm:block">{fc.label}</p>

                {/* Rain */}
                <div className="flex flex-col items-center w-16 shrink-0">
                  <div className="flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-blue-400" />
                    <p className="text-[10px] font-bold text-blue-400">{fc.rain}%</p>
                  </div>
                  <RainBar pct={fc.rain} color="#60a5fa" />
                </div>

                {/* Temps */}
                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <span className="text-xs font-black text-rose-400">{fc.high}°</span>
                  <span className="text-slate-700">·</span>
                  <span className="text-xs font-bold text-blue-400">{fc.low}°</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Selected day detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDay}
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="glass-panel rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />
            
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{day.date}</p>
              <h3 className="text-xl font-black text-slate-100 mt-0.5">{day.day}</h3>
              <p className="text-xs text-slate-400 font-semibold">{day.label}</p>
            </div>

            <div className="flex justify-center my-4">
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <WeatherIcon condition={day.condition} size={80} />
              </motion.div>
            </div>

            <div className="flex items-end justify-center gap-3 mb-4">
              <div className="text-center">
                <p className="text-[9px] text-slate-500 font-semibold uppercase">High</p>
                <p className="text-4xl font-black text-rose-400">{day.high}°</p>
              </div>
              <div className="w-px h-10 bg-slate-700 mb-1" />
              <div className="text-center">
                <p className="text-[9px] text-slate-500 font-semibold uppercase">Low</p>
                <p className="text-4xl font-black text-blue-400">{day.low}°</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1"><Droplets className="w-3 h-3 text-blue-400" /> Rain Chance</p>
                  <p className="text-[10px] font-bold text-blue-400">{day.rain}%</p>
                </div>
                <RainBar pct={day.rain} color="#60a5fa" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1"><Droplets className="w-3 h-3 text-emerald-400" /> Humidity</p>
                  <p className="text-[10px] font-bold text-emerald-400">{day.humidity}%</p>
                </div>
                <RainBar pct={day.humidity} color="#34d399" />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── AI Farming Advisory Cards ─────────────────────────── */}
      <div className="glass-panel rounded-3xl p-5 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-2 mb-4">
          <Sprout className="w-4 h-4 text-emerald-400" />
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">AI Farming Weather Advisories</p>
          <span className="ml-auto px-2 py-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full uppercase tracking-wider">
            KrishiCore AI
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeAdvisories.map((tip, i) => {
            const Icon = tip.priority === 'urgent' ? AlertTriangle : Sprout;
            const cardColor = tip.priority === 'urgent'
              ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
              : tip.priority === 'good'
              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
              : 'text-blue-400 bg-blue-500/10 border-blue-500/20';

            return (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-4 rounded-2xl border flex gap-3 text-left ${cardColor} ${
                  tip.priority === 'urgent' ? 'shadow-lg' : ''
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  <Icon className={`w-5 h-5 ${tip.priority === 'urgent' ? 'animate-pulse' : ''}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-bold text-slate-100">{tip.title}</p>
                    {tip.priority === 'urgent' && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase tracking-wider whitespace-nowrap">
                        Action Now
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{tip.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
