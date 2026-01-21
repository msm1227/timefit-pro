import React, { useEffect } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { TimerMode, TimerSettings } from '../App';
import SoundManager from '../utils/sound';

const soundManager = new SoundManager();

interface TimerControlsProps {
  mode: TimerMode;
  isRunning: boolean;
  currentTime: number;
  currentRound: number;
  isWork: boolean;
  isWarmup: boolean;
  setCurrentTime: (time: number) => void;
  setCurrentRound: (round: number) => void;
  setIsWork: (isWork: boolean) => void;
  setIsWarmup: (isWarmup: boolean) => void;
  setElapsedTime: (time: number) => void;
  setIsRunning: (running: boolean) => void;
  settings: TimerSettings;
  resetTimer: () => void;
}

const TimerControls: React.FC<TimerControlsProps> = ({
  mode,
  isRunning,
  currentTime,
  currentRound,
  isWork,
  isWarmup,
  setCurrentTime,
  setCurrentRound,
  setIsWork,
  setIsWarmup,
  setElapsedTime,
  setIsRunning,
  settings,
  resetTimer,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderWorkoutSummary = () => {
    if (isRunning) return null;

    if (mode === 'interval') {
      return (
        <div className="text-center mb-6 text-[#B3B3B3]">
          <p className="text-sm">
            {settings.rounds} rounds of {formatTime(settings.workTime || 0)} work / {formatTime(settings.restTime || 0)} rest
          </p>
        </div>
      );
    }

    if (mode === 'forTime') {
      return (
        <div className="text-center mb-6 text-[#B3B3B3]">
          <p className="text-sm">
            {formatTime(settings.time)} countdown
          </p>
        </div>
      );
    }

    return null;
  };

  // Initialize sound manager with user interaction
  const handleStart = async () => {
    // When resuming from pause, just toggle isRunning - don't reset any state
    setIsRunning(!isRunning);
    if (!isRunning) {
      // Just initialize sounds without playing
      soundManager.init().catch(console.warn);
    }
  };

  // Timer logic is now handled in App.tsx - sound manager initialization on start
  useEffect(() => {
    if (isRunning) {
      soundManager.init().catch(console.warn);
    }
  }, [isRunning]);

  return (
    <div className="space-y-6">
      {renderWorkoutSummary()}
      {/* Control Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleStart}
          className={`flex items-center px-6 py-3 rounded-lg text-white font-medium ${
            isRunning
              ? 'bg-[#FF9B71] hover:bg-[#FF8B61]'
              : 'bg-[#1D4ED8] hover:bg-[#2563EB]'
          } transition-colors`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 mr-2" /> Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" /> Start
            </>
          )}
        </button>
        <button
          onClick={resetTimer}
          className="flex items-center px-6 py-3 rounded-lg bg-[#404040] hover:bg-[#505050] text-white font-medium transition-colors"
        >
          <RefreshCw className="w-5 h-5 mr-2" /> Reset
        </button>
      </div>
    </div>
  );
};

export default TimerControls;