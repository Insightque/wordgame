import React from 'react';
import Card from './Card';
import { GameState, Selection, DragState } from '../types';

interface Props {
  gameState: GameState;
  selection: Selection | null;
  shakingCardId: string | null;
  hintedCardId: string | null;
  dragState: DragState | null; 
  onDrop: (e: React.DragEvent, loc: 'tableau'|'foundation', idx: number) => void;
  onCardClick: (loc: 'tableau', col: number, idx: number) => void;
  onDragStart: (e: React.DragEvent, loc: 'tableau', col: number, idx: number) => void;
  onTouchStart: (e: React.TouchEvent, loc: 'tableau', col: number, idx: number) => void;
}

const TableauArea: React.FC<Props> = ({ gameState, selection, shakingCardId, hintedCardId, dragState, onDrop, onCardClick, onDragStart, onTouchStart }) => {
  return (
    <section className="flex-1 w-full grid grid-cols-4 gap-1.5 px-0.5 pb-20">
      {gameState.columns.map((col, colIdx) => (
        <div 
          key={`col-${colIdx}`} 
          className="drop-zone relative min-h-[300px]"
          data-location="tableau"
          data-index={colIdx}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => onDrop(e, 'tableau', colIdx)}
          onClick={() => {
            if (selection && col.length === 0) onCardClick('tableau', colIdx, 0); 
          }}
        >
          <div className="w-full aspect-[3/4] rounded-xl border-2 border-white/30 bg-white/10 absolute top-0 left-0 pointer-events-none"></div>
          {col.map((card, cardIdx) => {
            const isDragging = dragState?.isActive && 
                               dragState.source.location === 'tableau' && 
                               dragState.source.colIndex === colIdx && 
                               cardIdx >= dragState.source.cardIndex;

            return (
              <Card
                key={card.id}
                card={card}
                index={cardIdx}
                isSelected={selection?.location === 'tableau' && selection.colIndex === colIdx && selection.cardIndex === cardIdx}
                isTop={cardIdx === col.length - 1}
                isHinted={hintedCardId === card.id}
                draggable={card.isFaceUp}
                onDragStart={(e) => onDragStart(e, 'tableau', colIdx, cardIdx)}
                onTouchStart={(e) => onTouchStart(e, 'tableau', colIdx, cardIdx)}
                onClick={() => onCardClick('tableau', colIdx, cardIdx)}
                isShaking={shakingCardId === card.id}
                style={{ 
                  position: 'absolute', 
                  top: `${cardIdx * 32}px`, 
                  zIndex: cardIdx,
                  opacity: isDragging ? 0 : 1 
                }}
              />
            );
          })}
        </div>
      ))}
    </section>
  );
};
export default TableauArea;