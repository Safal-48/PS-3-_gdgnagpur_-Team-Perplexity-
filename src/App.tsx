import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingLeaves } from './components/FloatingLeaves';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { Farm3DModel } from './components/Farm3DModel';
import { WeatherCard } from './components/WeatherCard';
import { DiseaseDetection } from './components/DiseaseDetection';
import { DiseaseDetectionPage } from './components/DiseaseDetectionPage';
import { WeatherPage } from './components/WeatherPage';
import { FarmingAssistant } from './components/FarmingAssistant';
import { FarmingAssistantPage } from './components/FarmingAssistantPage';
import { QuickActions } from './components/QuickActions';
import { RecentActivity } from './components/RecentActivity';
import { OperationsPage } from './components/OperationsPage';
import { FloatingAIAssistant } from './components/FloatingAIAssistant';
import { LoginPage } from './components/LoginPage';
import { Sprout } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden font-sans">
      {/* 3D Floating Leaves Animation Background */}
      <FloatingLeaves />

      {/* Decorative background grids & gradients */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#022c22_1px,transparent_1px),linear-gradient(to_bottom,#022c22_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none z-0" />
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-emerald-950/20 via-slate-950/0 to-transparent pointer-events-none z-0" />

      {/* Sidebar (Desktop only, mobile handled in Navbar) */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen relative z-10 overflow-hidden">
        {/* Top Navbar */}
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dashboard Pages */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto w-full max-w-[1400px] mx-auto z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full flex flex-col gap-6"
            >
              {/* Dashboard Layout */}
              {activeTab === 'dashboard' && (
                <>
                  {/* Row 1: Telemetry Statistics Cards */}
                  <section>
                    <StatsCards />
                  </section>

                  {/* Row 2: 3D Telemetry Model & Weather Station Info */}
                  <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <Farm3DModel />
                    </div>
                    <div className="lg:col-span-1">
                      <WeatherCard />
                    </div>
                  </section>

                  {/* Row 3: Diagnostics, AI Assistant Chat & Quick Operations */}
                  <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                      <DiseaseDetection />
                    </div>
                    <div className="lg:col-span-1">
                      <FarmingAssistant />
                    </div>
                    <div className="lg:col-span-1 flex flex-col gap-6">
                      <QuickActions />
                      <RecentActivity />
                    </div>
                  </section>
                </>
              )}

              {/* 3D Telemetry Tab */}
              {activeTab === '3d-map' && (
                <section className="grid grid-cols-1 gap-6">
                  <div className="glass-panel p-6 rounded-3xl text-left border-b border-emerald-500/10 mb-2">
                    <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                      <Sprout className="w-6 h-6 text-emerald-400" />
                      Visual Sensor Telemetry Console
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Explore detailed mapping coordinates of individual plant stalks, soil core humidity sensors, and thermal emitters.
                    </p>
                  </div>
                  <Farm3DModel />
                </section>
              )}

              {/* Weather Intelligence Tab */}
              {activeTab === 'weather' && (
                <section className="w-full">
                  <WeatherPage />
                </section>
              )}

              {/* Disease Scanner Tab */}
              {activeTab === 'disease' && (
                <section className="w-full">
                  <DiseaseDetectionPage />
                </section>
              )}

              {/* AI Advisor Chat Tab */}
              {activeTab === 'assistant' && (
                <section className="w-full">
                  <FarmingAssistantPage />
                </section>
              )}

              {/* Controls and Actions Tab */}
              {activeTab === 'controls' && (
                <section className="w-full">
                  <OperationsPage />
                </section>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global Floating AI Assistant Widget */}
      <FloatingAIAssistant onNavigateToAssistant={() => setActiveTab('assistant')} />
    </div>
  );
}

export default App;
