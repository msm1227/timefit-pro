import React from 'react';
import { Timer, Clock, Repeat } from 'lucide-react';
import { TimerMode } from '../App';

interface ModeSelectorProps {
  mode: TimerMode;
  setMode: (mode: TimerMode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, setMode }) => {
  const modes = [
    {
      id: 'interval' as TimerMode,
      name: 'Interval',
      icon: Repeat,
      description: 'Work/rest intervals with rounds',
    },
    {
      id: 'forTime' as TimerMode,
      name: 'For Time',
      icon: Timer,
      description: 'Countdown from a set time',
    },
    {
      id: 'stopwatch' as TimerMode,
      name: 'Stopwatch',
      icon: Clock,
      description: 'Count up from zero',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {modes.map(({ id, name, icon: Icon, description }) => (
        <button
          key={id}
          onClick={() => setMode(id)}
          className={`flex flex-col items-center p-4 rounded-xl transition-all ${
            mode === id
              ? 'bg-[#1D4ED8] border-2 border-[#1D4ED8]'
              : 'bg-[#181818] hover:bg-[#282828] border-2 border-transparent'
          }`}
        >
          <Icon
            className={`w-8 h-8 mb-2 ${
              mode === id ? 'text-white' : 'text-[#B3B3B3]'
            }`}
          />
          <span
            className={`text-sm font-medium ${
              mode === id ? 'text-white' : 'text-[#B3B3B3]'
            }`}
          >
            {name}
          </span>
          <span className="text-xs text-[#FFFFFF] text-center mt-1 opacity-60">
            {description}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ModeSelector;