import React from 'react';
import Card from './Card';
import { GameState, Selection, CardData } from '../types';
import { ALL_CATEGORIES } from '../constants';

interface Props {
  gameState: GameState;
  selection: Selection | null;
  onDrop: (e: React.DragEvent, loc: 'tableau'|'foundation', idx: number) => void;
  onClick: (idx: number) => void;
}

const FoundationArea: React.FC<Props> = ({ gameState, selection, onDrop, onClick }) => {
  return (
    <section className="w-full flex flex-wrap justify-center gap-1.5 shrink-0 mb-8 pt-6">
      {gameState.foundation.map((slot, idx) => {
        const firstCard = slot[0];
        const categoryInfo = firstCard ? ALL_CATEGORIES.find(c => c.id === firstCard.category) : null;
        
        return (
          <div 
            key={`foundation-${idx}`}
            className={`drop-zone relative w-[22%] aspect-[3/4] rounded-xl border-2 border-dashed flex flex-col items-center justify-center shrink-0 transition-all duration-500 bg-white/20 border-white/60`}
            data-location="foundation"
            data-index={idx}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, 'foundation', idx)}
            onClick={() => onClick(idx)}
          >
             {/* Persistent Category Label - Floating above the stack */}
             {categoryInfo && (
               <div 
                className="absolute -top-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-1 px-2 py-0.5 rounded-t-lg bg-white/90 backdrop-blur shadow-sm border-x border-t animate-in fade-in slide-in-from-bottom-1 duration-300 scale-90 whitespace-nowrap min-w-[60px] justify-center"
                style={{ borderColor: categoryInfo.color, color: categoryInfo.color }}
               >
                 <span className="text-xs filter drop-shadow-sm">{categoryInfo.emoji}</span>
                 <span className="text-[10px] font-bold text-slate-700 tracking-tighter">{categoryInfo.label}</span>
               </div>
             )}

             {slot.length === 0 && (
               <div className="flex flex-col items-center opacity-60 pointer-events-none">
                 <span className="text-white text-[10px] text-center font-bold">SET</span>
                 <div className="w-4 h-4 rounded-full border border-white/40 mt-1"></div>
               </div>
             )}
             
             {slot.map((card, cIdx) => (
               <Card 
                 key={card.id}
                 card={card}
                 index={cIdx}
                 isTop={cIdx === slot.length - 1}
                 onClick={() => onClick(idx)}
                 style={{ 
                   position: 'absolute', 
                   top: cIdx === 0 ? 0 : '4%', 
                   left: 0, 
                   zIndex: cIdx 
                 }}
               />
             ))}
          </div>
        );
      })}
    </section>
  );
};
export default FoundationArea;