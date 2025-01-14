import React, { useState, useEffect } from 'react';
import { TimerMode, TimerSettings } from '../App';

interface TimerDisplayProps {
  mode: TimerMode;
  isRunning: boolean;
  currentRound: number;
  isWork: boolean;
  isWarmup: boolean;
  elapsedTime: number;
  currentTime: number;
  settings: TimerSettings;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  mode,
  isRunning,
  currentRound,
  isWork,
  isWarmup,
  elapsedTime,
  currentTime,
  settings,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const renderDisplay = () => {
    if (mode === 'stopwatch') {
      return (
        <div className="text-center">
          <div className="text-6xl font-bold text-white">
            {formatTime(elapsedTime)}
          </div>
        </div>
      );
    }

    if (mode === 'interval') {
      return (
        <div className="text-center">
          <div className="text-6xl font-bold text-white mb-4">
            {formatTime(currentTime)}
          </div>
          <div className="text-lg font-medium space-y-1">
            {isWarmup && settings.enableWarmup ? (
              <div className="text-[#1D4ED8] font-bold">WARM UP</div>
            ) : (
              <div className="text-white">
                Round {currentRound}/{settings.rounds} -{' '}
                <span className={isWork ? 'text-[#1D4ED8]' : 'text-[#FF9B71]'}>
                  {isWork ? 'WORK' : 'REST'}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (mode === 'forTime') {
      return (
        <div className="text-center">
          <div className="text-6xl font-bold text-white mb-4">
            {formatTime(currentTime)}
          </div>
          <div className="text-lg font-medium space-y-1">
            {isWarmup && settings.enableWarmup ? (
              <div className="text-[#1D4ED8] font-bold">WARM UP</div>
            ) : null}
          </div>
        </div>
      );
    }

    return ( // Stopwatch mode
      <div className="text-center">
        <div className="text-6xl font-bold text-white">
          {formatTime(currentTime)}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#181818] rounded-xl p-6 shadow-inner">
      {renderDisplay()}
    </div>
  );
};

export default TimerDisplay;