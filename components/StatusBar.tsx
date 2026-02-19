import React from 'react';

interface StatusBarProps {
  levelLabel: string;
  levelColor: string;
  actionPoints: number;
  maxActionPoints: number;
  completedCount: number; // 여기서는 완료된 카테고리 수
  totalCount: number;     // 여기서는 전체 카테고리 수
  totalCoins: number;
  onReset: () => void;
}

const StatusBar: React.FC<StatusBarProps> = ({ 
  levelLabel, levelColor, actionPoints, maxActionPoints, 
  completedCount, totalCount, totalCoins, onReset 
}) => {
  
  const progressPct = Math.max(0, (actionPoints / maxActionPoints) * 100);
  const barColor = actionPoints < 10 ? 'bg-red-400' : 'bg-cute-dark-green';

  return (
    <div className="w-full bg-white/80 backdrop-blur-md border-b-4 border-cute-pink/30 shadow-sm p-2 z-[100] font-jua flex items-center justify-between gap-3 h-14">
      
      {/* Left: Menu Btn & Coins */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onReset}
          className="w-10 h-10 bg-cute-pink text-white text-lg rounded-full shadow-sm hover:scale-105 transition-transform flex items-center justify-center"
        >
          🏠
        </button>
        <div className="bg-yellow-100 px-2 py-1 rounded-full border-2 border-yellow-200 flex items-center gap-1 shadow-inner">
          <span className="text-sm">🪙</span>
          <span className="text-xs font-bold text-yellow-700">{totalCoins}</span>
        </div>
      </div>

      {/* Center: Progress & Categories */}
      <div className="flex-1 max-w-xs flex flex-col justify-center">
        <div className="flex justify-between text-[10px] text-gray-500 mb-0.5 px-1">
          <span className="font-bold text-blue-500">정리 완료: {completedCount}/{totalCount}</span>
          <span className={actionPoints < 10 ? 'text-red-500 animate-pulse font-bold' : 'text-gray-600 font-bold'}>
            턴: {actionPoints}
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