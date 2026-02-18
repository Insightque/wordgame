import React from 'react';

interface Props {
  isOpen: boolean;
  maxLevel: number;
  onSelectLevel: (level: number) => void;
  onClose: () => void;
}

const LevelSelectModal: React.FC<Props> = ({ isOpen, maxLevel, onSelectLevel, onClose }) => {
  if (!isOpen) return null;

  // Generate levels 1 to maxLevel
  const levels = Array.from({ length: maxLevel }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="bg-cute-sky p-4 flex items-center justify-between">
          <h2 className="text-white text-2xl font-bold drop-shadow-sm">레벨 선택</h2>
          <button onClick={onClose} className="bg-white/20 hover:bg-white/40 text-white rounded-full w-8 h-8 flex items-center justify-center">
            ✕
          </button>
        </div>

        {/* Grid */}
        <div className="p-4 grid grid-cols-5 gap-3 overflow-y-auto">
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => onSelectLevel(lvl)}
              className="aspect-square rounded-xl bg-slate-100 hover:bg-cute-yellow border-2 border-slate-200 hover:border-cute-dark-green text-slate-600 hover:text-cute-dark-green font-bold text-lg flex items-center justify-center transition-all active:scale-95"
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-400">
          높은 레벨을 깨면 더 많은 레벨이 열립니다!
        </div>
      </div>
    </div>
  );
};

export default LevelSelectModal;