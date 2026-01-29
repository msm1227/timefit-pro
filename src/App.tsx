import { useState, useEffect, useRef } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import TimerDisplay from './components/TimerDisplay';
import TimerControls from './components/TimerControls';
import ModeSelector from './components/ModeSelector';
import Settings from './components/Settings';
import SoundManager from './utils/sound';

export type TimerMode = 'forTime' | 'interval' | 'stopwatch';

export interface TimerSettings {
  time: number;
  rounds?: number;
  workTime?: number;
  restTime?: number;
  enableWarmup?: boolean;
}

function App() {
  const [mode, setMode] = useState<TimerMode>('interval');
  const [isRunning, setIsRunning] = useState(false);
  const [settings, setSettings] = useState<TimerSettings>({
    time: 300, // 5 minutes default
    rounds: 5,
    workTime: 60,
    restTime: 30,
    enableWarmup: true,
  });
  const [currentRound, setCurrentRound] = useState(1);
  const [isWork, setIsWork] = useState(true);
  const [isWarmup, setIsWarmup] = useState(settings.enableWarmup);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => {
    if (mode === 'interval') {
      return settings.enableWarmup ? 10 : settings.workTime || 60;
    } else if (mode === 'forTime') {
      return settings.enableWarmup ? 10 : settings.time;
    }
    return 0;
  });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTickRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);

  // Helper to reset timer state
  const resetTimer = (newMode: TimerMode = mode) => {
    setIsRunning(false);
    setCurrentRound(1);
    setIsWork(true);
    setIsWarmup(settings.enableWarmup ?? false);
    setElapsedTime(0);
    hasStartedRef.current = false; // Reset the started flag
    if (newMode === 'interval') {
      setCurrentTime(settings.enableWarmup ? 10 : settings.workTime || 60);
    } else if (newMode === 'forTime') {
      setCurrentTime(settings.enableWarmup ? 10 : settings.time);
    } else {
      setCurrentTime(0);
    }
  };

  // Timer logic with state transitions
  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      lastTickRef.current = null;
      return;
    }

    const soundManager = new SoundManager();
    soundManager.init().catch(console.warn);

    lastTickRef.current = Date.now();
    timerRef.current = setInterval(() => {
      if (!lastTickRef.current) return;
      const now = Date.now();
      const delta = Math.floor((now - lastTickRef.current) / 1000);

      if (delta > 0) {
        lastTickRef.current = now;

        setCurrentTime((prevTime) => {
          const newTime = prevTime - delta;

          // Handle timer reaching zero
          if (newTime <= 0) {
            if (mode === 'stopwatch') {
              setElapsedTime((prev) => prev + delta);
              return prevTime + delta;
            } else if (mode === 'forTime') {
              if (isWarmup && settings.enableWarmup) {
                // End of warmup
                soundManager.playTransition();
                setIsWarmup(false);
                return settings.time;
              } else {
                // Timer complete
                soundManager.playComplete();
                setIsRunning(false);
                setCurrentRound(1);
                setIsWork(true);
                setIsWarmup(settings.enableWarmup ?? false);
                setElapsedTime(0);
                return settings.enableWarmup ? 10 : settings.time;
              }
            } else if (mode === 'interval') {
              if (isWarmup && settings.enableWarmup) {
                // End of warmup
                soundManager.playTransition();
                setIsWarmup(false);
                setIsWork(true);
                return settings.workTime || 0;
              } else if (isWork) {
                // End of work period
                soundManager.playComplete();
                setIsWork(false);
                return settings.restTime || 0;
              } else {
                // End of rest period
                if (currentRound >= (settings.rounds || 1)) {
                  // Workout complete
                  soundManager.playComplete();
                  setIsRunning(false);
                  setCurrentRound(1);
                  setIsWork(true);
                  setIsWarmup(settings.enableWarmup ?? false);
                  setElapsedTime(0);
                  return settings.enableWarmup ? 10 : (settings.workTime || 60);
                } else {
                  // Next round
                  soundManager.playTransition();
                  setCurrentRound((prev) => prev + 1);
                  setIsWork(true);
                  return settings.workTime || 0;
                }
              }
            }
          }

          if (mode !== 'stopwatch') {
            return Math.max(newTime, 0);
          }

          setElapsedTime((prev) => prev + delta);
          return newTime;
        });
      }
    }, 250);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      lastTickRef.current = null;
    };
  }, [isRunning, mode, isWarmup, isWork, currentRound, settings]);

  // Track when timer has been started to prevent pause from resetting
  useEffect(() => {
    if (isRunning) {
      hasStartedRef.current = true;
    }
  }, [isRunning]);

  useEffect(() => {
    // Only reset if timer has never been started, or has been fully reset
    if (!isRunning && !hasStartedRef.current) {
      setIsWarmup(settings.enableWarmup ?? false);
      if (mode === 'forTime') {
        setCurrentTime(settings.enableWarmup ? 10 : settings.time);
      } else if (mode === 'interval') {
        setCurrentTime(settings.enableWarmup ? 10 : settings.workTime || 60);
      }
    }
  }, [settings.enableWarmup, settings.time, settings.workTime, mode]);

  const getBackgroundColor = () => {
    if (!isRunning) {
      return 'bg-[#191414]';
    }
    if (isWarmup && settings.enableWarmup) {
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
            aria-label="Open settings"
            onClick={() => {
              setShowSettings(!showSettings);
            }}
            className={`p-2 rounded-lg transition-colors ${
              showSettings ? 'bg-[#1D4ED8] text-white' : 'text-[#B3B3B3] hover:text-white'
            }`}
          >
            <SettingsIcon className="w-6 h-6" />
          </button>
        </div>

        {!showSettings && !isRunning && (
          <ModeSelector
            mode={mode}
            setMode={(newMode) => {
              resetTimer(newMode);
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
            resetTimer={resetTimer}
          />
        </div>}
      </div>
    </div>
  );
}

export default App;
