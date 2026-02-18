import React from 'react';
import Card from './Card';
import { GameState, Selection, CardData } from '../types';
import { isValidFoundationMove } from '../utils/gameUtils';

interface Props {
  gameState: GameState;
  selection: Selection | null;
  onDrop: (e: React.DragEvent, loc: 'tableau'|'foundation', idx: number) => void;
  onClick: (idx: number) => void;
}

const FoundationArea: React.FC<Props> = ({ gameState, selection, onDrop, onClick }) => {
  const getSelectedCards = (): CardData[] => {
    if (!selection) return [];
    if (selection.location === 'tableau') return gameState.columns[selection.colIndex].slice(selection.cardIndex);
    const card = gameState.waste[gameState.waste.length-1];
    return card ? [card] : [];
  };

  return (
    <section className="w-full flex flex-wrap justify-center gap-1.5 shrink-0 mb-4">
      {gameState.foundation.map((slot, idx) => {
        const isValid = selection && isValidFoundationMove(getSelectedCards(), slot);
        return (
          <div 
            key={`foundation-${idx}`}
            className={`drop-zone relative w-[22%] aspect-[3/4] rounded-xl border-2 border-dashed border-white/60 bg-white/20 flex flex-col items-center justify-center shrink-0 ${isValid ? 'bg-green-100/50 border-green-300' : ''}`}
            data-location="foundation"
            data-index={idx}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, 'foundation', idx)}
            onClick={() => onClick(idx)}
          >
             {slot.length === 0 && <span className="text-white text-[10px] text-center opacity-80">카테고리</span>}
             {slot.map((card, cIdx) => (
               <Card 
                 key={card.id}
                 card={card}
                 index={cIdx}
                 isTop={cIdx === slot.length - 1}
                 onClick={() => onClick(idx)}
                 style={{ position: 'absolute', top: cIdx === 0 ? 0 : '4%', left: 0, zIndex: cIdx }}
               />
             ))}
          </div>
        );
      })}
    </section>
  );
};
export default FoundationArea;