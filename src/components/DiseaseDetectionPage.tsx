import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, 
  Camera, 
  Play, 
  RefreshCw, 
  X, 
  ShieldAlert, 
  AlertTriangle, 
  Download, 
  Activity, 
  Sparkles,
  ArrowLeft
} from 'lucide-react';

interface MockDiagnosis {
  crop: string;
  disease: string;
  category: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High';
  treatment: string[];
  prevention: string[];
}

export const DiseaseDetectionPage: React.FC = () => {
  const [scanState, setScanState] = useState<'idle' | 'preview' | 'scanning' | 'results'>('idle');
  const [image, setImage] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [progressLog, setProgressLog] = useState('');
  const [dragActive, setDragActive] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const logs = [
    'Accessing KrishiCore AI image processing layer...',
    'Analyzing visual color-channel histograms...',
    'Isolating necrotic spot contours and margin patterns...',
    'Performing multi-class convolutional match...',
    'Generating organic treatment recommendations...'
  ];

  const mockReport: MockDiagnosis = {
    crop: 'Tomato (Zone A)',
    disease: 'Tomato Late Blight',
    category: 'Fungal Infection (Phytophthora infestans)',
    confidence: 94.8,
    severity: 'Medium',
    treatment: [
      'Immediately prune and bag all infected foliage in Zone A, Grid 4.',
      'Apply organic copper-based fungicide spray thoroughly across the canopy.',
      'Transition from overhead sprinklers to drip irrigation to keep leaf surfaces dry.'
    ],
    prevention: [
      'Increase planting space to 45cm to maximize wind airflow.',
      'Rotate crops next season with legumes or brassicas (non-solanaceous).',
      'Apply organic straw mulch to create a barrier against soil fungal spores.'
    ]
  };

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
        setScanState('results');
      }
    }, 850);

    return () => clearInterval(interval);
  }, [scanState]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  // Drag handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const url = URL.createObjectURL(file);
      setImage(url);
      setScanState('preview');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setImage(url);
      setScanState('preview');
    }
  };

  // Camera integration
  const startCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera capture access failed:', err);
      alert('Could not access device camera. Please check browser permissions or upload an image.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw mirror frame if user-facing, normal otherwise
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImage(dataUrl);
        setScanState('preview');
        stopCamera();
      }
    }
  };

  const triggerAnalyze = () => {
    setScanState('scanning');
  };

  const resetScanner = () => {
    setImage(null);
    setScanState('idle');
    stopCamera();
  };

  // Download text report
  const downloadReport = () => {
    const dateStr = new Date().toLocaleString();
    const content = `==================================================
KRISHIMITRA AI - CROP DIAGNOSTIC REPORT
Date/Time: ${dateStr}
Coordinates: 28.6139° N, 77.2090° E
Specimen: ${mockReport.crop}
==================================================

DIAGNOSIS RESULT:
--------------------------------------------------
* Crop: ${mockReport.crop}
* Diagnosed Disease: ${mockReport.disease}
* Pathogen Class: ${mockReport.category}
* Confidence Rating: ${mockReport.confidence}%
* Severity Classification: ${mockReport.severity} (Moderate risk of spread)

RECOMMENDED ORGANIC REMEDIES:
--------------------------------------------------
${mockReport.treatment.map((t, idx) => `${idx + 1}. ${t}`).join('\n')}

LONG-TERM PREVENTION ADVISORIES:
--------------------------------------------------
${mockReport.prevention.map((p, idx) => `${idx + 1}. ${p}`).join('\n')}

==================================================
Report compiled automatically by KrishiCore Neural Engine v1.8.
    `;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `krishimitra_report_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex flex-col gap-6 select-none">
      {/* Canvas for snapshotting */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Main Title Section */}
      <div className="glass-panel p-6 rounded-3xl text-left border-b border-emerald-500/10 flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-emerald-400" />
            AI Visual Disease Diagnostics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Feed leaf or canopy images to analyze blights, rust, virus infections, and nutrient shortages.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
          Active Diagnostic Engine
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Upload / Preview / Live camera */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div className="glass-panel rounded-3xl p-5 relative overflow-hidden min-h-[420px] flex flex-col justify-between">
            <div className="absolute top-0 left-0 w-full h-full bg-slate-950/20 pointer-events-none" />
            
            <AnimatePresence mode="wait">
              {/* IDLE state */}
              {scanState === 'idle' && !cameraActive && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer ${
                    dragActive
                      ? 'border-emerald-400 bg-emerald-950/20 scale-100 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                      : 'border-emerald-500/25 bg-slate-950/10 hover:border-emerald-500/40 hover:bg-slate-950/30'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <UploadCloud className="w-14 h-14 text-emerald-500/60 mb-4 animate-float-slow" />
                  <h3 className="text-sm font-bold text-slate-100">Drag & Drop Leaf Specimen</h3>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xs text-center leading-relaxed">
                    Drop a clear image of the leaf or click to select from your files.
                  </p>

                  <div className="flex items-center gap-3 mt-6">
                    <button 
                      onClick={(e) => { e.stopPropagation(); startCamera(); }}
                      className="px-4 py-2.5 rounded-xl glass-button-secondary text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-emerald-400" /> Use Camera
                    </button>
                    <button className="px-4 py-2.5 rounded-xl glass-button-primary text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer">
                      Browse Files
                    </button>
                  </div>
                </motion.div>
              )}

              {/* CAMERA state */}
              {cameraActive && (
                <motion.div
                  key="camera"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col justify-between rounded-2xl overflow-hidden relative bg-black/40 min-h-[350px]"
                >
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover max-h-[350px] rounded-xl"
                  />

                  {/* Camera overlay UI */}
                  <div className="absolute inset-0 flex flex-col justify-between p-4 z-10 pointer-events-none">
                    <button
                      onClick={stopCamera}
                      className="pointer-events-auto p-2 bg-slate-950/80 border border-emerald-500/20 rounded-full hover:border-emerald-500/40 text-slate-300 self-end transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    
                    {/* Centered target grid */}
                    <div className="self-center w-48 h-48 border border-emerald-500/20 rounded-2xl relative flex items-center justify-center">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                    </div>

                    <div className="self-center pointer-events-auto flex items-center justify-center gap-4 mt-2">
                      <button
                        onClick={capturePhoto}
                        className="w-14 h-14 bg-emerald-500 border-4 border-white/20 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform cursor-pointer"
                      >
                        <div className="w-6 h-6 bg-slate-950 rounded-full" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* PREVIEW state */}
              {scanState === 'preview' && image && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col gap-4"
                >
                  <div className="relative rounded-2xl border border-emerald-500/10 overflow-hidden bg-slate-950/50 flex-1 flex items-center justify-center max-h-[350px]">
                    <img
                      src={image}
                      alt="Crop Specimen Preview"
                      className="max-h-[320px] w-auto object-contain rounded-xl p-2"
                    />
                    <button
                      onClick={resetScanner}
                      className="absolute top-3 right-3 p-2 bg-slate-950/80 border border-emerald-500/20 rounded-full hover:border-emerald-500/40 text-slate-300 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={resetScanner}
                      className="px-4 py-2.5 rounded-xl glass-button-secondary text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" /> Change Image
                    </button>
                    <button
                      onClick={triggerAnalyze}
                      className="px-6 py-2.5 rounded-xl glass-button-primary text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-emerald-500/10"
                    >
                      <Play className="w-4 h-4" /> Run Diagnosis
                    </button>
                  </div>
                </motion.div>
              )}

              {/* SCANNING state */}
              {scanState === 'scanning' && image && (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col gap-4 items-center justify-center relative min-h-[350px]"
                >
                  <div className="relative rounded-2xl border border-emerald-500/30 overflow-hidden bg-slate-950/50 max-h-[280px] w-full flex items-center justify-center">
                    <img
                      src={image}
                      alt="Scanning Crop"
                      className="max-h-[250px] w-auto object-contain opacity-50 p-2"
                    />
                    
                    {/* Animated laser line */}
                    <div className="absolute left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-laser z-10" />
                  </div>

                  {/* Neural diagnostics load state */}
                  <div className="w-full flex flex-col items-center gap-2 mt-2">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-extrabold uppercase tracking-widest animate-pulse">
                      <Sparkles className="w-4 h-4" /> Neural Analysis in Progress
                    </div>
                    <div className="w-64 h-1.5 bg-slate-900 border border-emerald-500/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 4.25, ease: 'linear' }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                      />
                    </div>
                    <p className="text-[10px] font-mono text-emerald-500/80 max-w-xs text-center mt-1 truncate">
                      {progressLog}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* RESULTS state */}
              {scanState === 'results' && image && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col gap-4"
                >
                  <div className="relative rounded-2xl border border-emerald-500/10 overflow-hidden bg-slate-950/50 flex-1 flex items-center justify-center max-h-[300px]">
                    <img
                      src={image}
                      alt="Crop Specimen Preview"
                      className="max-h-[270px] w-auto object-contain rounded-xl p-2"
                    />
                    <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-rose-500/80 backdrop-blur-md text-[9px] font-bold text-white uppercase tracking-wider">
                      Tomato Late Blight Detected
                    </div>
                  </div>

                  <div className="flex gap-3 justify-between items-center border-t border-emerald-500/10 pt-3">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Scan ID: #KM-35912</span>
                    <button
                      onClick={resetScanner}
                      className="px-4 py-2.5 rounded-xl glass-button-secondary text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" /> Start New Scan
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Diagnosis / Prevention / Actions */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <AnimatePresence mode="wait">
            {scanState !== 'results' ? (
              <motion.div
                key="details-empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-panel rounded-3xl p-6 relative overflow-hidden min-h-[420px] flex flex-col justify-between select-none"
              >
                <div className="absolute -top-16 -left-16 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex flex-col items-center justify-center text-center my-auto">
                  <Activity className="w-12 h-12 text-emerald-500/35 mb-4 animate-pulse" />
                  <h3 className="text-sm font-bold text-slate-300">Awaiting Crop Diagnosis</h3>
                  <p className="text-[11px] text-slate-500 max-w-xs mt-1 leading-relaxed">
                    Upload a leaf photograph or capture one live. Our neural diagnostic module will compile severity metrics, pathological classifications, treatments, and local download options here.
                  </p>
                </div>

                <div className="p-4 bg-emerald-950/20 border border-emerald-500/10 rounded-2xl text-left flex items-start gap-2.5">
                  <div className="p-1 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">INFO</div>
                  <p className="text-[10px] text-slate-400 leading-normal font-semibold">
                    Sensor nodes register uniform nitrogen and moisture levels in Zone 1. Diagnosis parameters are tailored specifically to Solanaceae (tomato) foliage growth models.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="details-results"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col gap-5"
              >
                {/* Core diagnosis summary */}
                <div className="glass-panel rounded-3xl p-5 relative overflow-hidden flex flex-col gap-4 text-left">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

                  <div className="flex gap-3.5 items-start">
                    <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 h-fit">
                      <AlertTriangle className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-md font-bold text-slate-100">{mockReport.disease}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/25">
                          {mockReport.severity} Severity
                        </span>
                      </div>
                      <p className="text-[11px] text-rose-400 font-semibold mt-0.5">{mockReport.category}</p>
                    </div>
                  </div>

                  {/* Confidence score */}
                  <div className="p-4 bg-slate-950/40 border border-emerald-500/5 rounded-2xl flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">AI Classification Confidence</span>
                      <p className="text-xs text-slate-300 font-semibold mt-1">High index match. Remediate with certified organic components.</p>
                    </div>
                    <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="28"
                          cy="28"
                          r="24"
                          className="stroke-slate-800"
                          strokeWidth="4"
                          fill="transparent"
                        />
                        <motion.circle
                          cx="28"
                          cy="28"
                          r="24"
                          className="stroke-rose-400"
                          strokeWidth="4"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 24}
                          initial={{ strokeDashoffset: 2 * Math.PI * 24 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 24 * (1 - 0.948) }}
                          transition={{ duration: 1 }}
                        />
                      </svg>
                      <span className="absolute text-[10px] font-extrabold text-rose-400">95%</span>
                    </div>
                  </div>
                </div>

                {/* Treatment Advisories */}
                <div className="glass-panel rounded-3xl p-5 text-left relative overflow-hidden">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2.5">
                    Recommended Remedies
                  </h4>
                  <ul className="text-xs text-slate-300 font-medium flex flex-col gap-2.5">
                    {mockReport.treatment.map((t, idx) => (
                      <li key={idx} className="flex gap-2 items-start leading-normal">
                        <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Long-term prevention tips */}
                <div className="glass-panel rounded-3xl p-5 text-left relative overflow-hidden">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2.5">
                    Prevention & Pro-active Tips
                  </h4>
                  <ul className="text-xs text-slate-300 font-medium flex flex-col gap-2.5">
                    {mockReport.prevention.map((p, idx) => (
                      <li key={idx} className="flex gap-2 items-start leading-normal">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-2" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Download Report Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={downloadReport}
                    className="flex-1 py-3 px-4 rounded-2xl glass-button-primary text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-emerald-500/10"
                  >
                    <Download className="w-4 h-4" /> Download Diagnostic Report
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
