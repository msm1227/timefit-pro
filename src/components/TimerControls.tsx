import React, { useEffect } from 'react';
import { Play, Pause, RefreshCw, SkipForward } from 'lucide-react';
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

  const calculateTotalTime = () => {
    if (mode === 'interval') {
      const workTotal = (settings.workTime || 0) * (settings.rounds || 0);
      const restTotal = (settings.restTime || 0) * (settings.rounds || 0);
      const warmup = settings.enableWarmup ? 10 : 0;
      return workTotal + restTotal + warmup;
    }
    return 0;
  };

  const calculateRemainingTime = () => {
    if (mode !== 'interval') return 0;

    // Current phase time remaining
    let remaining = currentTime;

    // If in warmup, add all rounds
    if (isWarmup) {
      remaining += (settings.workTime || 0) * (settings.rounds || 0);
      remaining += (settings.restTime || 0) * (settings.rounds || 0);
    } else {
      // If in work phase, add rest time for this round
      if (isWork) {
        remaining += (settings.restTime || 0);
      }

      // Add remaining rounds
      const remainingRounds = (settings.rounds || 0) - currentRound;
      remaining += remainingRounds * ((settings.workTime || 0) + (settings.restTime || 0));
    }

    return remaining;
  };

  const handleSkip = () => {
    if (mode !== 'interval' || !isRunning) return;

    if (isWarmup) {
      // Skip warmup, go to first work period
      setIsWarmup(false);
      setIsWork(true);
      setCurrentTime(settings.workTime || 0);
    } else if (isWork) {
      // Skip to rest period
      setIsWork(false);
      setCurrentTime(settings.restTime || 0);
    } else {
      // Skip rest, go to next round or end
      if (currentRound >= (settings.rounds || 1)) {
        // Workout complete
        setIsRunning(false);
        setCurrentRound(1);
        setIsWork(true);
        setIsWarmup(settings.enableWarmup ?? false);
        setElapsedTime(0);
        setCurrentTime(settings.enableWarmup ? 10 : (settings.workTime || 60));
      } else {
        // Next round
        setCurrentRound(currentRound + 1);
        setIsWork(true);
        setCurrentTime(settings.workTime || 0);
      }
    }
  };

  const renderWorkoutSummary = () => {
    if (isRunning) return null;

    if (mode === 'interval') {
      const totalTime = calculateTotalTime();
      return (
        <div className="text-center mb-6 text-[#B3B3B3]">
          <p className="text-sm">
            {settings.rounds} rounds of {formatTime(settings.workTime || 0)} work / {formatTime(settings.restTime || 0)} rest
          </p>
          <p className="text-xs mt-1">
            Total time: {formatTime(totalTime)}
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
      {/* Total Time Remaining - shown during interval workout */}
      {mode === 'interval' && isRunning && (
        <div className="text-center text-white text-xl font-semibold">
          Total time remaining: {formatTime(calculateRemainingTime())}
        </div>
      )}
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
        {mode === 'interval' && isRunning && (
          <button
            onClick={handleSkip}
            className="flex items-center px-6 py-3 rounded-lg bg-[#0891B2] hover:bg-[#06B6D4] text-white font-medium transition-colors"
          >
            <SkipForward className="w-5 h-5 mr-2" /> Skip
          </button>
        )}
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