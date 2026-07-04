import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';
import { ShieldCheck, Droplet, Thermometer, Info } from 'lucide-react';

// Animated crop component
const Crop: React.FC<{ position: [number, number, number]; scale: number; delay: number }> = ({ position, scale, delay }) => {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    // Organic wind sway
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.z = Math.sin(time * 2 + delay) * 0.05;
    meshRef.current.rotation.x = Math.cos(time * 1.5 + delay) * 0.03;
  });

  return (
    <group ref={meshRef} position={position} scale={[scale, scale, scale]}>
      {/* Plant Stem */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.8, 8]} />
        <meshStandardMaterial color="#10b981" roughness={0.7} />
      </mesh>
      
      {/* Plant Leaf 1 */}
      <mesh position={[0.15, 0.6, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.2, 0.02, 0.1]} />
        <meshStandardMaterial color="#34d399" roughness={0.6} />
      </mesh>

      {/* Plant Leaf 2 */}
      <mesh position={[-0.15, 0.45, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.18, 0.02, 0.1]} />
        <meshStandardMaterial color="#059669" roughness={0.6} />
      </mesh>

      {/* Sprout Head (Fruit or bud) */}
      <mesh position={[0, 0.82, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.4} emissive="#d97706" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
};

// Spinning island representing the farm plot
const FarmPlot: React.FC<{ activeMetric: string; setActiveMetric: (metric: string) => void }> = ({ activeMetric, setActiveMetric }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    // Slow rotational drift
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.05;
  });

  // Hotspot details
  const hotspots = [
    {
      id: 'moisture',
      position: [-1.2, 0.6, 1.2] as [number, number, number],
      label: 'Moisture: 42.8%',
      icon: Droplet,
      color: 'bg-emerald-500 border-emerald-400',
      textColor: 'text-emerald-400'
    },
    {
      id: 'temp',
      position: [1.3, 0.7, -1.0] as [number, number, number],
      label: 'Temp: 24.5°C',
      icon: Thermometer,
      color: 'bg-amber-500 border-amber-400',
      textColor: 'text-amber-400'
    },
    {
      id: 'ph',
      position: [0.0, 0.5, 0.0] as [number, number, number],
      label: 'pH level: 6.5',
      icon: ShieldCheck,
      color: 'bg-emerald-500 border-emerald-400',
      textColor: 'text-emerald-400'
    }
  ];

  return (
    <group ref={groupRef}>
      {/* Base Soil layer */}
      <mesh receiveShadow position={[0, -0.2, 0]}>
        <cylinderGeometry args={[2.5, 2.7, 0.6, 32]} />
        <meshStandardMaterial 
          color="#064e3b" 
          roughness={0.9} 
          metalness={0.1}
          flatShading
        />
      </mesh>
      
      {/* Grass/Surface layer */}
      <mesh receiveShadow position={[0, 0.12, 0]}>
        <cylinderGeometry args={[2.52, 2.52, 0.08, 32]} />
        <meshStandardMaterial 
          color="#022c22" 
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>

      {/* Grid Border - Tech Grid */}
      <gridHelper args={[4.8, 8, '#10b981', 'rgba(16, 185, 129, 0.07)']} position={[0, 0.17, 0]} />

      {/* Crops arranged in rows */}
      <Crop position={[-1.5, 0.16, -1.0]} scale={0.7} delay={0} />
      <Crop position={[-0.8, 0.16, -1.0]} scale={0.75} delay={0.5} />
      <Crop position={[0.0, 0.16, -1.0]} scale={0.7} delay={1.0} />
      <Crop position={[0.8, 0.16, -1.0]} scale={0.8} delay={1.5} />
      <Crop position={[1.5, 0.16, -1.0]} scale={0.72} delay={2.0} />

      <Crop position={[-1.2, 0.16, 0.0]} scale={0.8} delay={0.2} />
      <Crop position={[-0.5, 0.16, 0.0]} scale={0.68} delay={0.7} />
      <Crop position={[0.5, 0.16, 0.0]} scale={0.74} delay={1.2} />
      <Crop position={[1.2, 0.16, 0.0]} scale={0.78} delay={1.7} />

      <Crop position={[-1.5, 0.16, 1.0]} scale={0.75} delay={0.4} />
      <Crop position={[-0.8, 0.16, 1.0]} scale={0.8} delay={0.9} />
      <Crop position={[0.0, 0.16, 1.0]} scale={0.7} delay={1.4} />
      <Crop position={[0.8, 0.16, 1.0]} scale={0.73} delay={1.9} />
      <Crop position={[1.5, 0.16, 1.0]} scale={0.77} delay={2.4} />

      {/* Hotspots */}
      {hotspots.map((hs) => {
        const Icon = hs.icon;
        const isSelected = activeMetric === hs.id;

        return (
          <Html
            key={hs.id}
            position={hs.position}
            center
            distanceFactor={8}
            className="pointer-events-none select-none z-10"
          >
            <div 
              onClick={() => setActiveMetric(hs.id)}
              className={`pointer-events-auto cursor-pointer flex items-center gap-1.5 px-2 py-1 rounded-lg border backdrop-blur-md shadow-lg transition-all duration-300 ${
                isSelected 
                  ? 'bg-emerald-950/90 border-emerald-400 scale-110 shadow-emerald-500/20' 
                  : 'bg-slate-950/70 border-emerald-500/20 hover:border-emerald-400/60 scale-100'
              }`}
            >
              <div className={`w-2 h-2 rounded-full animate-ping absolute -top-1 -right-1 ${hs.color}`} />
              <div className={`w-2 h-2 rounded-full absolute -top-1 -right-1 ${hs.color}`} />
              
              <Icon className={`w-3 h-3 ${hs.textColor}`} />
              <span className="text-[9px] font-bold text-white whitespace-nowrap tracking-wide">
                {hs.label}
              </span>
            </div>
          </Html>
        );
      })}

      {/* Glowing boundary markers (Visual technology element) */}
      <mesh position={[-2.3, 0.2, -2.3]}>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[2.3, 0.2, -2.3]}>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-2.3, 0.2, 2.3]}>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[2.3, 0.2, 2.3]}>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
};

export const Farm3DModel: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState('moisture');

  const metricDetails: Record<string, { title: string; desc: string; health: string }> = {
    moisture: {
      title: 'Zone Moisture Network',
      desc: 'Capacitive sensors reporting uniform moisture dispersion at 15cm soil depth.',
      health: 'Optimal (42.8%)'
    },
    temp: {
      title: 'Thermodynamic Sensor B1',
      desc: 'Ambient canopy temperature matching growth charts. High diurnal fluctuation expected.',
      health: 'Normal (24.5°C)'
    },
    ph: {
      title: 'Soil Acidic Index',
      desc: 'Micro-pH probes report stable soil conditions suitable for tomato and corn nitrogen fixation.',
      health: 'Neutral (6.5 pH)'
    }
  };

  return (
    <div className="w-full h-[320px] md:h-[450px] glass-panel rounded-3xl p-5 flex flex-col relative overflow-hidden group">
      {/* Glow corner effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-2 relative z-10">
        <div>
          <h3 className="text-md font-bold text-slate-100 flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-400" />
            Interactive 3D Crop Plot
          </h3>
          <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            Rotate & click nodes to analyze real-time telemetry
          </p>
        </div>
        
        {/* Floating status tag */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-bold">
          <span>Active Plot: Zone 1</span>
        </div>
      </div>

      {/* R3F Canvas Container */}
      <div className="flex-1 w-full relative">
        <Canvas
          shadows
          camera={{ position: [4, 4.5, 4], fov: 50 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          {/* Ambient Lighting */}
          <ambientLight intensity={0.4} />
          
          {/* Directional Key Lighting with Shadows */}
          <directionalLight
            castShadow
            position={[5, 10, 5]}
            intensity={1.2}
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0001}
          />
          
          {/* Subtle Accent Blue Fill Light */}
          <directionalLight
            position={[-5, 2, -5]}
            intensity={0.3}
            color="#38bdf8"
          />

          {/* Floating object wraps the model */}
          <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.2}>
            <FarmPlot activeMetric={activeMetric} setActiveMetric={setActiveMetric} />
          </Float>

          {/* Glowing particle system in background */}
          <Sparkles count={40} scale={5} size={1.5} speed={0.4} color="#10b981" />

          {/* Controls */}
          <OrbitControls 
            enableZoom={true} 
            maxPolarAngle={Math.PI / 2.1} // Stop rotating below ground
            minDistance={3.5}
            maxDistance={8}
          />
        </Canvas>
      </div>

      {/* Telemetry info card overlay */}
      <div className="mt-4 p-3 bg-slate-950/60 border border-emerald-500/10 rounded-xl relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        <div>
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            {metricDetails[activeMetric].title}
          </h4>
          <p className="text-[11px] text-slate-300 leading-normal font-medium mt-0.5">
            {metricDetails[activeMetric].desc}
          </p>
        </div>
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg min-w-32">
          <span className="text-[9px] text-slate-400 font-semibold tracking-wide uppercase">Current value:</span>
          <span className="text-xs font-black text-emerald-400 tracking-tight">
            {metricDetails[activeMetric].health}
          </span>
        </div>
      </div>
    </div>
  );
};
