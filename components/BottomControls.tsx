import React from 'react';
import Card from './Card';
import { GameState, Selection, DragState } from '../types';

interface Props {
  gameState: GameState;
  selection: Selection | null;
  shakingCardId: string | null;
  hintedCardId: string | null;
  dragState: DragState | null;
  hintsUsed: number;
  totalCoins: number;
  onStockClick: () => void;
  onCardClick: (loc: 'waste', col: number, idx: number) => void;
  onDragStart: (e: React.DragEvent, loc: 'waste', col: number, idx: number) => void;
  onTouchStart: (e: React.TouchEvent, loc: 'waste', col: number, idx: number) => void;
  onUseHint: () => void;
}

const BottomControls: React.FC<Props> = ({ 
  gameState, selection, shakingCardId, hintedCardId, dragState, hintsUsed, totalCoins,
  onStockClick, onCardClick, onDragStart, onTouchStart, onUseHint 
}) => {
  const canHint = selection !== null && hintsUsed < 3 && totalCoins >= 20;

  return (
    <section className="h-28 w-full shrink-0 flex items-end justify-center gap-4 pb-6 bg-gradient-to-t from-cute-sky via-cute-sky to-transparent z-20">
      
      {/* Stock */}
      <div className="relative w-[16%] max-w-[70px] aspect-[3/4] cursor-pointer group active:scale-95" onClick={onStockClick}>
        {gameState.stock.length > 0 ? (
          <>
            {gameState.stock.slice(0, 3).map((_, i) => (
              <div key={i} className="absolute w-full h-full rounded-xl border-2 border-white bg-cute-pink shadow-md" style={{ top: `${-i * 2}px`, left: `${i * 1}px`, zIndex: i }}>
                <div className="w-full h-full flex items-center justify-center text-white text-xs opacity-50">✿</div>
              </div>
            ))}
            <div className="absolute -bottom-5 w-full text-center">
              <span className="bg-white/80 text-pink-600 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">{gameState.stock.length}</span>
            </div>
          </>
        ) : (
          <div className="w-full h-full rounded-xl border-2 border-white/50 flex flex-col items-center justify-center bg-white/10">
            <span className="text-white text-2xl mb-1">↺</span>
          </div>
        )}
      </div>

      {/* Hint Button */}
      <button 
        onClick={onUseHint}
        disabled={!canHint}
        className={`
          relative w-[22%] max-w-[90px] h-12 rounded-2xl flex flex-col items-center justify-center transition-all shadow-md active:scale-90
          ${canHint ? 'bg-yellow-400 hover:bg-yellow-300 text-white' : 'bg-gray-200 text-gray-400 grayscale opacity-60 cursor-not-allowed'}
        `}
      >
        <span className="text-xs font-bold leading-none">힌트 찬스</span>
        <div className="flex items-center gap-0.5 mt-0.5">
          <span className="text-[10px] font-bold">🪙 20</span>
          <span className="text-[9px] bg-white/30 px-1 rounded ml-1">{hintsUsed}/3</span>
        </div>
      </button>

      {/* Waste */}
      <div className="relative w-[16%] max-w-[70px] aspect-[3/4]">
        {gameState.waste.length > 0 ? (
          gameState.waste.slice(-1).map((card) => {
            const isDragging = dragState?.isActive && dragState.source.location === 'waste';
            return (
              <Card
                key={card.id}
                card={card}
                index={gameState.waste.length - 1} 
                isSelected={selection?.location === 'waste' && selection.cardIndex === gameState.waste.length - 1}
                isTop={true}
                isHinted={hintedCardId === card.id}
                draggable={true}
                onDragStart={(e) => onDragStart(e, 'waste', 0, gameState.waste.length - 1)}
                onTouchStart={(e) => onTouchStart(e, 'waste', 0, gameState.waste.length - 1)}
                onClick={() => onCardClick('waste', 0, gameState.waste.length - 1)}
                isShaking={shakingCardId === card.id}
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  zIndex: 1,
                  opacity: isDragging ? 0 : 1
                }}
              />
            );
          })
        ) : (
          <div className="w-full h-full rounded-xl border-2 border-dashed border-white/50 flex items-center justify-center text-center p-1">
            <span className="text-white/80 text-[10px]">OPEN</span>
          </div>
        )}
      </div>
    </section>
  );
};
export default BottomControls;