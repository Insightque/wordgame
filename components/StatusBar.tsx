import React from 'react';

interface StatusBarProps {
  levelLabel: string;
  levelColor: string;
  actionPoints: number;
  maxActionPoints: number;
  completedCount: number;
  totalCount: number;
  onReset: () => void;
}

const StatusBar: React.FC<StatusBarProps> = ({ levelLabel, levelColor, actionPoints, maxActionPoints, completedCount, totalCount, onReset }) => {
  
  const progressPct = Math.max(0, (actionPoints / maxActionPoints) * 100);
  const barColor = actionPoints < 10 ? 'bg-red-400' : 'bg-cute-dark-green';

  return (
    <div className="w-full bg-white/80 backdrop-blur-md border-b-4 border-cute-pink/30 shadow-sm p-2 z-[100] font-jua flex items-center justify-between gap-3 h-14">
      
      {/* Left: Menu Btn */}
      <button 
        onClick={onReset}
        className="w-10 h-10 bg-cute-pink text-white text-lg rounded-full shadow-sm hover:scale-105 transition-transform flex items-center justify-center"
      >
        🏠
      </button>

      {/* Center: Progress Bar */}
      <div className="flex-1 max-w-xs flex flex-col justify-center">
        <div className="flex justify-between text-xs text-gray-500 mb-1 px-1">
          <span>남은 턴</span>
          <span className={actionPoints < 10 ? 'text-red-500 animate-pulse font-bold' : 'text-gray-600 font-bold'}>
            {actionPoints} / {maxActionPoints}
          </span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
          <div 
            className={`h-full transition-all duration-500 ease-out rounded-full ${barColor}`} 
            style={{ width: `${progressPct}%` }}
          ></div>
        </div>
      </div>

      {/* Right: Badge */}
      <div className={`px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm ${levelColor}`}>
        {levelLabel.split(' ')[0]}
      </div>
    </div>
  );
};

export default StatusBar;