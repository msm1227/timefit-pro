import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import TimerDisplay from './components/TimerDisplay';
import TimerControls from './components/TimerControls';
import ModeSelector from './components/ModeSelector';
import Settings from './components/Settings';

export type TimerMode = 'forTime' | 'interval' | 'stopwatch';

export interface TimerSettings {
  time: number;
  rounds?: number;
  workTime?: number;
  restTime?: number;
  warmupTime?: number;
}

function App() {
  const [mode, setMode] = useState<TimerMode>('forTime');
  const [isRunning, setIsRunning] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [isWork, setIsWork] = useState(true);
  const [isWarmup, setIsWarmup] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<TimerSettings>({
    time: 300, // 5 minutes default
    rounds: 5,
    workTime: 60,
    restTime: 30,
    warmupTime: 10, // Fixed 10-second warmup
  });
  const [currentTime, setCurrentTime] = useState(() => {
    // Initialize current time based on mode
    if (mode === 'interval') {
      return settings.warmupTime || 10;
    } else if (mode === 'forTime') {
      return settings.warmupTime || 10;
    }
    return 0;
  });

  // Update current time when mode changes
  useEffect(() => {
    if (!isRunning) {
      if (mode === 'interval') {
        setCurrentTime(settings.warmupTime || 10);
      } else if (mode === 'forTime') {
        setCurrentTime(settings.warmupTime || 10);
      } else {
        setCurrentTime(0);
      }
    }
  }, [mode, settings, isRunning]);

  const getBackgroundColor = () => {
    if (!isRunning) {
      return 'bg-[#191414]';
    }
    if (isWarmup) {
      return 'bg-yellow-500';
    }
    if (mode === 'interval' && !isWork) {
      return 'bg-yellow-500';
    }
    return 'bg-green-500';
  };

  return (
    <div className={`min-h-screen ${getBackgroundColor()} transition-colors duration-300 flex items-center justify-center p-4`}>
      <div className="bg-[#282828] rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">
            Workout Timer
          </h1>
          <button
            onClick={() => {
              if (isRunning) {
                setIsRunning(false);
                setCurrentRound(1);
                setIsWork(true);
                setIsWarmup(true);
                setElapsedTime(0);
                if (mode === 'interval') {
                  setCurrentTime(settings.warmupTime || 60);
                } else if (mode === 'forTime') {
                  setCurrentTime(settings.time);
                } else {
                  setCurrentTime(0);
                }
              }
              setShowSettings(!showSettings);
            }}
            className={`p-2 rounded-lg transition-colors ${
              showSettings ? 'bg-[#1D4ED8] text-white' : 'text-[#B3B3B3] hover:text-white'
            }`}
          >
            <SettingsIcon className="w-6 h-6" />
          </button>
        </div>

        {!showSettings && (
          <ModeSelector
            mode={mode}
            setMode={(newMode) => {
              if (isRunning) {
                setIsRunning(false);
                setCurrentRound(1);
                setIsWork(true);
                setIsWarmup(true);
                setElapsedTime(0);
                if (newMode === 'interval') {
                  setCurrentTime(settings.warmupTime || 60);
                } else if (newMode === 'forTime') {
                  setCurrentTime(settings.time);
                } else {
                  setCurrentTime(0);
                }
              }
              setMode(newMode);
            }}
          />
        )}
        
        <div className="mt-8">
          <TimerDisplay
            mode={mode}
            currentTime={currentTime}
            isRunning={isRunning}
            currentRound={currentRound}
            isWork={isWork}
            isWarmup={isWarmup}
            elapsedTime={elapsedTime}
            settings={settings}
          />
        </div>        
        
        <Settings
          mode={mode}
          isRunning={isRunning}
          settings={settings}
          setSettings={setSettings}
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
        
        {!showSettings && <div className="mt-8 border-t border-[#404040] pt-6">
          <TimerControls
            mode={mode}
            isRunning={isRunning}
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            setIsRunning={setIsRunning}
            setCurrentRound={setCurrentRound}
            setIsWork={setIsWork}
            setIsWarmup={setIsWarmup}
            setElapsedTime={setElapsedTime}
            currentRound={currentRound}
            isWork={isWork}
            isWarmup={isWarmup}
            elapsedTime={elapsedTime}
            settings={settings}
            setSettings={setSettings}
          />
        </div>}
      </div>
    </div>
  );
}

export default App;
