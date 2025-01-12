import React from 'react';
import { TimerMode, TimerSettings } from '../App';

interface SettingsProps {
  mode: TimerMode;
  isRunning: boolean;
  settings: TimerSettings;
  setSettings: (settings: TimerSettings) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface QuickSelectWorkout {
  name: string;
  description: string;
  settings: Partial<TimerSettings>;
}

const Settings: React.FC<SettingsProps> = ({
  mode,
  isRunning,
  settings,
  setSettings,
  isOpen,
  onClose,
}) => {
  const quickSelectWorkouts: QuickSelectWorkout[] = [
    {
      name: '2:30 x 4',
      description: '4 rounds, 2:30 work, no rest',
      settings: {
        rounds: 4,
        workTime: 150, // 2:30 in seconds
        restTime: 0,
      },
    },
    {
      name: '10 MIN EMOM',
      description: '10 rounds, 1 min work, no rest',
      settings: {
        rounds: 10,
        workTime: 60,
        restTime: 0,
      },
    },
    {
      name: '20 MIN EMOM',
      description: '10 rounds, 2 min work, no rest',
      settings: {
        rounds: 10,
        workTime: 120,
        restTime: 0,
      },
    },
  ];

  const handleMinutesChange = (minutes: number) => {
    const currentSeconds = settings.time % 60;
    setSettings({ ...settings, time: (minutes * 60) + currentSeconds });
  };

  const handleSecondsChange = (seconds: number) => {
    const currentMinutes = Math.floor(settings.time / 60);
    setSettings({ ...settings, time: (currentMinutes * 60) + seconds });
  };

  const handleWorkMinutesChange = (minutes: number) => {
    const currentSeconds = settings.workTime! % 60;
    setSettings({ ...settings, workTime: (minutes * 60) + currentSeconds });
  };

  const handleWorkSecondsChange = (seconds: number) => {
    const currentMinutes = Math.floor(settings.workTime! / 60);
    setSettings({ ...settings, workTime: (currentMinutes * 60) + seconds });
  };

  const handleRestMinutesChange = (minutes: number) => {
    const currentSeconds = settings.restTime! % 60;
    setSettings({ ...settings, restTime: (minutes * 60) + currentSeconds });
  };

  const handleRestSecondsChange = (seconds: number) => {
    const currentMinutes = Math.floor(settings.restTime! / 60);
    setSettings({ ...settings, restTime: (currentMinutes * 60) + seconds });
  };

  const handleWarmupMinutesChange = (minutes: number) => {
    const currentSeconds = settings.warmupTime! % 60;
    setSettings({ ...settings, warmupTime: (minutes * 60) + currentSeconds });
  };

  const handleWarmupSecondsChange = (seconds: number) => {
    const currentMinutes = Math.floor(settings.warmupTime! / 60);
    setSettings({ ...settings, warmupTime: (currentMinutes * 60) + seconds });
  };

  const handleRoundsChange = (rounds: number) => {
    setSettings({ ...settings, rounds });
  };

  if (!isOpen) return null;

  return (
    <div className="mt-8 border-t border-[#404040] pt-6">
      <h2 className="text-xl font-semibold text-white mb-4">Settings</h2>
      <div className="space-y-6">
        {mode === 'interval' && (
          <div>
            <h3 className="text-sm font-medium text-white mb-3">Quick Select Workouts</h3>
            <div className="grid grid-cols-3 gap-3">
              {quickSelectWorkouts.map((workout) => (
                <button
                  key={workout.name}
                  onClick={() => {
                    if (!isRunning) {
                      setSettings({
                        ...settings,
                        ...workout.settings,
                      });
                    }
                  }}
                  disabled={isRunning}
                  className={`p-3 rounded-lg text-left transition-colors ${
                    isRunning
                      ? 'bg-[#232323] cursor-not-allowed opacity-50'
                      : 'bg-[#181818] hover:bg-[#1D4ED8] hover:text-white'
                  }`}
                >
                  <div className="text-sm font-medium text-white">
                    {workout.name}
                  </div>
                  <div className="text-xs text-[#B3B3B3] mt-1">
                    {workout.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === 'forTime' && (
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-white mb-1">
                Minutes
              </label>
              <input
                type="number"
                min="0"
                max="59"
                value={Math.floor(settings.time / 60)}
                onChange={(e) => handleMinutesChange(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#181818] text-white border border-[#404040] rounded-md shadow-sm focus:ring-[#1D4ED8] focus:border-[#1D4ED8]"
                disabled={isRunning}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-white mb-1">
                Seconds
              </label>
              <input
                type="number"
                min="0"
                max="59"
                value={settings.time % 60}
                onChange={(e) => handleSecondsChange(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#181818] text-white border border-[#404040] rounded-md shadow-sm focus:ring-[#1D4ED8] focus:border-[#1D4ED8]"
                disabled={isRunning}
              />
            </div>
          </div>
        )}

        {mode === 'interval' && (
          <>
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Rounds
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={settings.rounds}
                onChange={(e) => handleRoundsChange(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#181818] text-white border border-[#404040] rounded-md shadow-sm focus:ring-[#1D4ED8] focus:border-[#1D4ED8]"
                disabled={isRunning}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Work Time
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-white opacity-75 mb-1">
                    Minutes
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={Math.floor((settings.workTime || 0) / 60)}
                    onChange={(e) => handleWorkMinutesChange(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#181818] text-white border border-[#404040] rounded-md shadow-sm focus:ring-[#1D4ED8] focus:border-[#1D4ED8]"
                    disabled={isRunning}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-white opacity-75 mb-1">
                    Seconds
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={(settings.workTime || 0) % 60}
                    onChange={(e) => handleWorkSecondsChange(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#181818] text-white border border-[#404040] rounded-md shadow-sm focus:ring-[#1D4ED8] focus:border-[#1D4ED8]"
                    disabled={isRunning}
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Rest Time
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-white opacity-75 mb-1">
                    Minutes
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={Math.floor((settings.restTime || 0) / 60)}
                    onChange={(e) => handleRestMinutesChange(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#181818] text-white border border-[#404040] rounded-md shadow-sm focus:ring-[#1D4ED8] focus:border-[#1D4ED8]"
                    disabled={isRunning}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-white opacity-75 mb-1">
                    Seconds
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={(settings.restTime || 0) % 60}
                    onChange={(e) => handleRestSecondsChange(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#181818] text-white border border-[#404040] rounded-md shadow-sm focus:ring-[#1D4ED8] focus:border-[#1D4ED8]"
                    disabled={isRunning}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="mt-8 flex justify-center">
        <button
          onClick={onClose}
          className="px-6 py-3 bg-[#1D4ED8] hover:bg-[#2563EB] text-white font-medium rounded-lg transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default Settings;