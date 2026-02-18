import React, { useState } from 'react';
import Card from './components/Card';
import StatusBar from './components/StatusBar';
import WinModal from './components/WinModal';
import FoundationArea from './components/FoundationArea';
import TableauArea from './components/TableauArea';
import BottomControls from './components/BottomControls';
import LevelSelectModal from './components/LevelSelectModal';
import { getLevelSettings, playSound } from './utils/gameUtils';
import { useGameEngine } from './hooks/useGameEngine';
import { useDragInteraction } from './hooks/useDragInteraction';

const App: React.FC = () => {
  const { gameState, setGameState, startGame, handleStockClick, executeMove, totalWinCount, maxReachedLevel, resetAllData } = useGameEngine();
  const { 
    selection, setSelection, shakingCardId, dragState, 
    handleCardClick, handleFoundationClick, handleDragStart, handleDrop, handleTouchStart 
  } = useDragInteraction(gameState, executeMove);

  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const currentSettings = getLevelSettings(gameState.level);

  if (gameState.gameStatus === 'intro') {
    return (
      <div className="h-[100dvh] w-full bg-cute-sky flex flex-col items-center justify-center p-4 relative overflow-hidden font-jua">
        <div className="absolute inset-0 bg-clouds pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-grass z-0"></div>
        
        {/* Settings Button */}
        <button 
          onClick={() => setShowResetConfirm(!showResetConfirm)}
          className="absolute top-4 right-4 z-50 p-2 bg-white/50 hover:bg-white/80 rounded-full text-xl shadow-sm transition-colors"
          title="설정"
        >
          ⚙️
        </button>

        {/* Reset Confirmation Tooltip */}
        {showResetConfirm && (
          <div className="absolute top-16 right-4 z-50 bg-white p-3 rounded-xl shadow-xl border-2 border-red-200 animate-in fade-in slide-in-from-top-2 w-48 text-center">
            <p className="text-xs text-gray-500 mb-2">모든 진행상황을<br/>초기화 하시겠습니까?</p>
            <div className="flex gap-2 justify-center">
               <button 
                 onClick={() => { resetAllData(); setShowResetConfirm(false); }}
                 className="px-3 py-1 bg-red-400 text-white rounded-lg text-xs hover:bg-red-500"
               >
                 초기화
               </button>
               <button 
                 onClick={() => setShowResetConfirm(false)}
                 className="px-3 py-1 bg-gray-200 text-gray-600 rounded-lg text-xs hover:bg-gray-300"
               >
                 취소
               </button>
            </div>
          </div>
        )}

        <h1 className="text-5xl md:text-6xl text-white mb-2 text-center drop-shadow-lg z-10 tracking-tight" style={{ textShadow: '2px 2px 0 #88b0c9' }}>
          단어 스파이더
        </h1>
        <p className="text-blue-600 mb-10 text-center text-lg z-10 bg-white/50 px-4 py-1 rounded-full">
          짝꿍 카드를 찾아 정리해주세요!
        </p>

        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl border-4 border-white shadow-xl max-w-sm w-full z-10 flex flex-col items-center gap-3">
          {/* Main Play Button */}
          <button 
            onClick={() => startGame(maxReachedLevel)} 
            className="w-full py-4 rounded-xl text-white text-2xl shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center bg-cute-dark-green animate-pulse"
          >
            {maxReachedLevel > 1 ? `이어하기 (Lv.${maxReachedLevel})` : '게임 시작'}
          </button>

          {/* Level Select Button */}
          {maxReachedLevel > 1 && (
            <button 
              onClick={() => setIsLevelSelectOpen(true)}
              className="w-full py-3 rounded-xl text-slate-600 bg-slate-100 border-2 border-slate-200 text-xl font-bold shadow-sm transition-all hover:bg-slate-200 active:scale-95"
            >
              레벨 선택
            </button>
          )}
        </div>

        <LevelSelectModal 
          isOpen={isLevelSelectOpen} 
          maxLevel={maxReachedLevel} 
          onSelectLevel={(lvl) => {
            setIsLevelSelectOpen(false);
            startGame(lvl);
          }} 
          onClose={() => setIsLevelSelectOpen(false)} 
        />
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full bg-cute-sky flex flex-col items-center touch-none select-none font-jua overflow-hidden relative">
      <div className="absolute inset-0 bg-clouds pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-full h-24 bg-grass z-0"></div>

      <div className="w-full z-50 shrink-0">
        <StatusBar 
          levelLabel={currentSettings.label} levelColor={currentSettings.color}
          actionPoints={gameState.actionPoints} maxActionPoints={gameState.maxActionPoints}
          completedCount={gameState.foundation.reduce((a,c) => a + c.length, 0)} totalCount={totalWinCount}
          onReset={() => { playSound('tap'); setGameState(prev => ({ ...prev, gameStatus: 'intro' })); }}
        />
      </div>

      <main className="flex-1 w-full max-w-[450px] flex flex-col pt-4 pb-2 px-2 overflow-y-auto no-scrollbar z-10">
        <FoundationArea gameState={gameState} selection={selection} onDrop={handleDrop} onClick={handleFoundationClick} />
        <TableauArea 
          gameState={gameState} selection={selection} shakingCardId={shakingCardId} dragState={dragState}
          onDrop={handleDrop} onCardClick={handleCardClick} onDragStart={handleDragStart} onTouchStart={handleTouchStart}
        />
      </main>

      <BottomControls 
        gameState={gameState} selection={selection} shakingCardId={shakingCardId} dragState={dragState}
        onStockClick={handleStockClick} onCardClick={handleCardClick} onDragStart={handleDragStart} onTouchStart={handleTouchStart}
      />

      {/* Drag Preview */}
      {dragState && (
        <div className="fixed pointer-events-none z-[999] opacity-90"
          style={{ left: dragState.currentX, top: dragState.currentY, width: dragState.width, transform: 'translate(-50%, -50%) rotate(5deg)' }}
        >
          {dragState.cards.map((card, i) => (
             <div key={card.id} className="absolute w-full" style={{ top: `${i * 25}px` }}>
                <Card card={card} index={0} isTop={i === dragState.cards.length - 1} onClick={() => {}} style={{ boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }} />
             </div>
          ))}
        </div>
      )}

      <WinModal 
        gameStatus={gameState.gameStatus} score={gameState.actionPoints}
        onNextLevel={() => startGame(gameState.level + 1)} onRetry={() => startGame(gameState.level)}
        onHome={() => { playSound('tap'); setGameState(prev => ({ ...prev, gameStatus: 'intro' })); }}
      />
    </div>
  );
};

export default App;