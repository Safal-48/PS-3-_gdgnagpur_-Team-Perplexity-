import React, { useState, useEffect } from 'react';
import { UploadCloud, AlertTriangle, Play, RefreshCw, X, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DiseaseDetection: React.FC = () => {
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [progressLog, setProgressLog] = useState<string>('');
  
  const logs = [
    'Initializing AI disease detector...',
    'Segmenting leaf contours...',
    'Analyzing chlorophyll density ratios...',
    'Matching features against disease model database...',
    'Generating diagnosis report...'
  ];

  useEffect(() => {
    if (scanState !== 'scanning') return;

    let index = 0;
    setProgressLog(logs[0]);

    const interval = setInterval(() => {
      index++;
      if (index < logs.length) {
        setProgressLog(logs[index]);
      } else {
        clearInterval(interval);
        setScanState('success');
      }
    }, 800);

    return () => clearInterval(interval);
  }, [scanState]);

  const handleSimulateScan = () => {
    setScanState('scanning');
  };

  const handleReset = () => {
    setScanState('idle');
  };

  return (
    <div className="glass-panel rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between h-fit min-h-[380px] select-none group">
      {/* Background glow overlay */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/15 transition-all duration-300" />
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-emerald-500/10 pb-3 relative z-10">
        <div>
          <h3 className="text-md font-bold text-slate-100 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            AI Disease Scanner
          </h3>
          <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Visual Diagnostic Engine</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
          Model v1.8
        </div>
      </div>

      {/* Main scanner area */}
      <div className="my-4 flex-grow flex items-center justify-center relative z-10 min-h-[180px]">
        <AnimatePresence mode="wait">
          {scanState === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full flex flex-col items-center justify-center border-2 border-dashed border-emerald-500/20 hover:border-emerald-500/40 rounded-2xl p-6 bg-slate-950/20 hover:bg-slate-950/40 transition-all cursor-pointer group/uploader"
              onClick={handleSimulateScan}
            >
              <UploadCloud className="w-10 h-10 text-emerald-500/60 group-hover/uploader:text-emerald-400 group-hover/uploader:scale-105 transition-all duration-300 mb-2.5" />
              <p className="text-xs font-semibold text-slate-200 text-center">
                Drag & drop crop leaf image here
              </p>
              <p className="text-[10px] text-slate-400 text-center mt-1">
                Supports JPG, PNG up to 10MB
              </p>
              <button className="mt-4 px-4 py-2 text-[11px] font-bold uppercase tracking-wider rounded-xl glass-button-primary flex items-center gap-1.5">
                <Play className="w-3 h-3" /> Simulate Scanner
              </button>
            </motion.div>
          )}

          {scanState === 'scanning' && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col items-center justify-center relative border border-emerald-500/30 bg-slate-950/30 rounded-2xl p-6 overflow-hidden min-h-[180px]"
            >
              {/* Animated Laser Scanning Line */}
              <div className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_10px_#34d399] animate-laser" />
              
              <div className="relative w-16 h-16 flex items-center justify-center mb-4">
                <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin" />
              </div>
              
              <p className="text-xs font-bold text-slate-100">Scanning Crop Specimen...</p>
              
              <div className="w-48 h-1 bg-slate-900 rounded-full mt-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 4, ease: 'linear' }}
                  className="h-full bg-emerald-400"
                />
              </div>

              <p className="text-[9px] font-mono text-emerald-500/70 mt-3 h-4 text-center">
                {progressLog}
              </p>
            </motion.div>
          )}

          {scanState === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full flex flex-col gap-3"
            >
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex gap-3 items-start text-left">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <AlertTriangle className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-100">Tomato Late Blight</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      94% Match
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                    Fungal infection (Phytophthora infestans) detected in Zone A leaf sample.
                  </p>
                </div>
              </div>

              {/* Diagnosis details */}
              <div className="grid grid-cols-2 gap-2 text-left">
                <div className="p-2.5 bg-slate-950/40 border border-emerald-500/5 rounded-xl">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Severity</span>
                  <p className="text-xs font-bold text-amber-400 mt-0.5">Medium (Spread Risk)</p>
                </div>
                <div className="p-2.5 bg-slate-950/40 border border-emerald-500/5 rounded-xl">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Treat Window</span>
                  <p className="text-xs font-bold text-emerald-400 mt-0.5">Immediate (24-48h)</p>
                </div>
              </div>

              {/* Remedies */}
              <div className="p-3 bg-emerald-950/20 border border-emerald-500/10 rounded-xl text-left">
                <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Recommended Remedies</span>
                <ul className="text-[10px] text-slate-300 font-medium list-disc list-inside mt-1 flex flex-col gap-1">
                  <li>Prune infected foliage & isolate Zone A grid 4.</li>
                  <li>Apply organic copper fungicide spray immediately.</li>
                  <li>Reduce morning overhead irrigation; keep leaves dry.</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl glass-button-secondary flex items-center justify-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Close
                </button>
                <button
                  onClick={handleSimulateScan}
                  className="flex-1 px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl glass-button-primary flex items-center justify-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Rescan
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
