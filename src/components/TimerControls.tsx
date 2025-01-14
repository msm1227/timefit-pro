import React, { useState, useEffect } from 'react';
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
  elapsedTime: number;
  setCurrentTime: (time: number) => void;
  setCurrentRound: (round: number) => void;
  setIsWork: (isWork: boolean) => void;
  setIsWarmup: (isWarmup: boolean) => void;
  setElapsedTime: (time: number) => void;
  setIsRunning: (running: boolean) => void;
  settings: TimerSettings;
  setSettings: (settings: TimerSettings) => void;
}

const TimerControls: React.FC<TimerControlsProps> = ({
  mode,
  isRunning,
  currentTime,
  currentRound,
  isWork,
  isWarmup,
  elapsedTime,
  setCurrentTime,
  setCurrentRound,
  setIsWork,
  setIsWarmup,
  setElapsedTime,
  setIsRunning,
  settings,
  setSettings,
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
    setIsRunning(!isRunning);
    if (!isRunning) {
      // Just initialize sounds without playing
      soundManager.init().catch(console.warn);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        if (mode === 'stopwatch') {
          setElapsedTime((prev) => prev + 1);
        } else if (mode === 'forTime') {
          if (currentTime <= 0) {
            if (isWarmup && settings.enableWarmup) {
              // Play sound at end of warmup
              soundManager.playTransition();
              setIsWarmup(false);
              setCurrentTime(settings.time);
            } else {
              // Timer complete
              soundManager.playComplete();
              setIsRunning(false);
              // Reset to initial state
              setCurrentRound(1);
              setIsWork(true);
              setIsWarmup(settings.enableWarmup);
              setElapsedTime(0);
              if (mode === 'forTime') {
                setCurrentTime(settings.enableWarmup ? 10 : settings.time);
              }
            }
          } else {
            setCurrentTime(currentTime - 1);
          }
        } else if (mode === 'interval') {
          if (currentTime <= 0) {
            if (isWarmup && settings.enableWarmup) {
              // Play sound at end of warmup
              soundManager.playTransition();
              setIsWarmup(false);
              setIsWork(true);
              setCurrentTime(settings.workTime || 0);
            } else if (isWork) {
              // Transition from work to rest
              soundManager.playComplete();
              setIsWork(false);
              setCurrentTime(settings.restTime || 0);
            } else {
              // Transition from rest to next round or end
              if (currentRound >= (settings.rounds || 1)) {
                soundManager.playComplete();
                setIsRunning(false);
                // Reset to initial state
                setCurrentRound(1);
                setIsWork(true);
                setIsWarmup(settings.enableWarmup);
                setElapsedTime(0);
                setCurrentTime(settings.enableWarmup ? 10 : settings.workTime || 60);
              } else {
                soundManager.playTransition();
                setCurrentRound(currentRound + 1);
                setIsWork(true);
                setCurrentTime(settings.workTime || 0);
              }
            }
          } else {
            setCurrentTime(currentTime - 1);
          }
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, mode, currentTime, currentRound, isWork, isWarmup, settings]);

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
          onClick={() => {
            setIsRunning(false);
            setCurrentRound(1);
            setIsWork(true);
            setIsWarmup(settings.enableWarmup);
            setElapsedTime(0);
            if (mode === 'stopwatch') {
              setCurrentTime(0);
            } else if (mode === 'forTime') {
              setCurrentTime(settings.enableWarmup ? 10 : settings.time);
            } else {
              setCurrentTime(settings.enableWarmup ? 10 : settings.workTime || 60);
            }
          }}
          className="flex items-center px-6 py-3 rounded-lg bg-[#404040] hover:bg-[#505050] text-white font-medium transition-colors"
        >
          <RefreshCw className="w-5 h-5 mr-2" /> Reset
        </button>
      </div>
    </div>
  );
};

export default TimerControls;