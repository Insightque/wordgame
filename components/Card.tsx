import React from 'react';
import { CardData } from '../types';
import { ALL_CATEGORIES } from '../constants';

interface CardProps {
  card: CardData;
  index: number;
  isSelected?: boolean;
  isShaking?: boolean;
  isTop?: boolean; // New prop to determine layout
  onClick: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  // Added Touch Handler
  onTouchStart?: (e: React.TouchEvent) => void; 
  draggable?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const Card: React.FC<CardProps> = ({ card, isSelected, isShaking, isTop = false, onClick, onDragStart, onTouchStart, draggable, style, className = '' }) => {
  const categoryInfo = ALL_CATEGORIES.find(c => c.id === card.category);
  const isMaster = card.type === 'master';
  
  const catColor = categoryInfo?.color || '#e5e7eb';
  const catEmoji = categoryInfo?.emoji || '❓';
  const catLabel = categoryInfo?.label || '???';

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      draggable={draggable}
      onDragStart={onDragStart}
      onTouchStart={onTouchStart} // Bind touch start
      style={style}
      className={`
        relative w-full aspect-[3/4] rounded-xl transition-all duration-200
        flex flex-col select-none cursor-pointer overflow-hidden font-jua
        ${isSelected ? 'ring-4 ring-cute-yellow z-50 scale-105' : ''}
        ${isShaking ? 'animate-shake ring-2 ring-red-400 z-50' : ''}
        ${card.isFaceUp ? 'shadow-md' : 'shadow-sm'}
        ${className}
        touch-none /* Crucial for custom touch drag */
      `}
    >
      {card.isFaceUp ? (
        isMaster ? (
          // --- MASTER CARD (Target Category) ---
          <div 
            className="w-full h-full flex flex-col bg-white border-2 border-dashed relative overflow-hidden"
            style={{ borderColor: catColor }}
          >
             {/* Header */}
             <div 
               className="w-full py-1 flex items-center justify-center px-1 border-b-2 border-dashed"
               style={{ backgroundColor: `${catColor}40`, borderColor: `${catColor}80` }}
             >
                <span className="text-[10px] font-bold truncate leading-tight opacity-90 text-slate-700">
                  {catLabel}
                </span>
             </div>

             {/* Content */}
             <div className="flex-1 flex flex-col items-center justify-center -mt-1 bg-white">
                <div className="text-3xl animate-float filter drop-shadow-sm">{catEmoji}</div>
             </div>
          </div>
        ) : (
          // --- WORD CARD (Neutral / Hidden Category) ---
          <div 
            className={`w-full h-full bg-white relative overflow-hidden flex flex-col ${isTop ? 'border-2' : 'border'} border-slate-300`}
          >
             {/* Consistent Pattern for ALL Word Cards */}
             <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:10px_10px]"></div>
             
             {/* Generic Watermark */}
             <div className="absolute -bottom-4 -right-4 text-6xl opacity-[0.03] pointer-events-none transform -rotate-12">
               🧩
             </div>

             {/* LAYOUT 1: STACKED (Covered) - Optimized for visibility */}
             {!isTop && (
               <>
                 <div className="h-1.5 w-full bg-slate-100 border-b border-slate-200 shrink-0"></div>
                 <div className="w-full flex justify-center items-start pt-1 px-0.5 z-10 relative overflow-hidden">
                   <span className="text-[12px] font-bold text-center leading-tight tracking-tight text-slate-600 break-words w-full">
                     {card.word}
                   </span>
                 </div>
               </>
             )}

             {/* LAYOUT 2: TOP (Fully Visible) */}
             {isTop && (
               <div className="w-full h-full flex flex-col items-center justify-center relative p-2">
                 <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                 <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                 <span className="text-lg text-slate-700 font-bold text-center break-words leading-tight z-10 drop-shadow-sm w-full">
                   {card.word}
                 </span>
                 <div className="mt-2 w-8 h-1 bg-slate-200 rounded-full shrink-0"></div>
               </div>
             )}
          </div>
        )
      ) : (
        // --- CARD BACK ---
        <div className="w-full h-full bg-cute-pink rounded-xl border-2 border-white flex items-center justify-center relative shadow-inner group">
            <div className="absolute inset-1.5 border border-white/60 rounded-lg border-dashed"></div>
            <div className="text-white text-xl opacity-90 group-hover:scale-110 transition-transform duration-300">✿</div>
        </div>
      )}
    </div>
  );
};

export default Card;