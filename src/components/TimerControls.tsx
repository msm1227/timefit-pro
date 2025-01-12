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
            if (isWarmup) {
              // Play sound at end of warmup
              soundManager.playTransition();
              setIsWarmup(false);
              setCurrentTime(settings.time);
            } else {
              // Timer complete
              soundManager.playComplete();
              setIsRunning(false);
            }
          } else {
            setCurrentTime(currentTime - 1);
          }
        } else if (mode === 'interval') {
          if (currentTime <= 0) {
            if (isWarmup) {
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
                setCurrentTime(0);
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
            setIsWarmup(true);
            setElapsedTime(0);
            if (mode === 'stopwatch') {
              setCurrentTime(0);
            } else if (mode === 'forTime') {
              setCurrentTime(settings.warmupTime || 10);
            } else {
              setCurrentTime(settings.warmupTime || 60);
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