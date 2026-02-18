import React, { useState, useCallback, useEffect } from 'react';
import { GameState, CardData, Selection, DragState } from '../types';
import { isValidTableauMove, isValidFoundationMove, playSound, triggerHaptic } from '../utils/gameUtils';

export const useDragInteraction = (
  gameState: GameState,
  executeMove: (sL: 'tableau'|'waste', sC: number, sI: number, tL: 'tableau'|'foundation', tI: number) => void
) => {
  const [selection, setSelection] = useState<Selection | null>(null);
  const [shakingCardId, setShakingCardId] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);

  const triggerShake = useCallback((cardId: string) => {
    playSound('error'); triggerHaptic('error');
    setShakingCardId(cardId);
    setTimeout(() => setShakingCardId(null), 400);
  }, []);

  const getMovingCards = (loc: 'tableau' | 'waste', col: number, idx: number): CardData[] => {
    if (loc === 'tableau') return gameState.columns[col].slice(idx);
    const card = gameState.waste[gameState.waste.length - 1];
    return card ? [card] : [];
  };

  // --- Click / Tap Logic ---
  const handleCardClick = (loc: 'tableau' | 'waste', col: number, idx: number) => {
    if (gameState.gameStatus !== 'playing') return;

    if (selection && selection.location === loc && selection.colIndex === col && selection.cardIndex === idx) {
      setSelection(null); playSound('tap'); return;
    }

    if (selection) {
      const moving = getMovingCards(selection.location, selection.colIndex, selection.cardIndex);
      if (loc === 'tableau' && moving.length > 0 && isValidTableauMove(moving[0], gameState.columns[col])) {
        executeMove(selection.location, selection.colIndex, selection.cardIndex, 'tableau', col);
        setSelection(null); return;
      }
    }

    if (loc === 'tableau') {
      const stack = gameState.columns[col].slice(idx);
      const isHomogeneous = stack.every(c => c.category === stack[0].category && c.isFaceUp);
      if (!isHomogeneous) { triggerShake(gameState.columns[col][idx].id); return; }
    }
    
    playSound('pop'); triggerHaptic('light');
    setSelection({ location: loc, colIndex: col, cardIndex: idx });
  };

  const handleFoundationClick = (idx: number) => {
    if (!selection) return;
    const moving = getMovingCards(selection.location, selection.colIndex, selection.cardIndex);
    if (isValidFoundationMove(moving, gameState.foundation[idx])) {
      executeMove(selection.location, selection.colIndex, selection.cardIndex, 'foundation', idx);
      setSelection(null);
    } else {
      triggerShake(moving[0]?.id || 'error');
    }
  };

  // --- HTML5 Drag ---
  const handleDragStart = (e: React.DragEvent, loc: 'tableau'|'waste', col: number, idx: number) => {
    if (gameState.gameStatus !== 'playing') return;
    if (loc === 'tableau') {
      const stack = gameState.columns[col].slice(idx);
      if (!stack.every(c => c.category === stack[0].category && c.isFaceUp)) {
        e.preventDefault(); triggerShake(gameState.columns[col][idx].id); return;
      }
    }
    playSound('pop'); triggerHaptic('light');
    e.dataTransfer.setData('app/json', JSON.stringify({ location: loc, colIndex: col, cardIndex: idx }));
    setSelection({ location: loc, colIndex: col, cardIndex: idx });
  };

  const handleDrop = (e: React.DragEvent, targetLoc: 'tableau'|'foundation', targetIdx: number) => {
    e.preventDefault();
    if (gameState.gameStatus !== 'playing') return;
    const data = e.dataTransfer.getData('app/json');
    if (!data) return;
    const { location, colIndex, cardIndex } = JSON.parse(data);
    if (location === targetLoc && colIndex === targetIdx) return;

    const moving = getMovingCards(location, colIndex, cardIndex);
    const valid = targetLoc === 'tableau' 
      ? isValidTableauMove(moving[0], gameState.columns[targetIdx])
      : isValidFoundationMove(moving, gameState.foundation[targetIdx]);

    if (valid) {
      playSound('tap'); executeMove(location, colIndex, cardIndex, targetLoc, targetIdx);
      setSelection(null);
    } else {
      triggerShake(moving[0].id); setSelection(null);
    }
  };

  // --- Touch Drag ---
  const handleTouchStart = (e: React.TouchEvent, loc: 'tableau'|'waste', col: number, idx: number) => {
    if (gameState.gameStatus !== 'playing') return;
    let cards: CardData[] = [];
    if (loc === 'tableau') {
      const stack = gameState.columns[col].slice(idx);
      if (!stack.every(c => c.category === stack[0].category && c.isFaceUp)) {
        triggerShake(gameState.columns[col][idx].id); return;
      }
      cards = stack;
    } else {
      const card = gameState.waste[gameState.waste.length - 1];
      if (!card) return; cards = [card];
    }
    playSound('pop'); triggerHaptic('light');
    const touch = e.touches[0];
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragState({
      isActive: true, cards, source: { location: loc, colIndex: col, cardIndex: idx },
      startX: touch.clientX, startY: touch.clientY, currentX: touch.clientX, currentY: touch.clientY, width: rect.width
    });
    setSelection({ location: loc, colIndex: col, cardIndex: idx });
  };

  useEffect(() => {
    if (!dragState) return;
    const move = (e: TouchEvent) => { 
      e.preventDefault(); 
      setDragState(p => p ? { ...p, currentX: e.touches[0].clientX, currentY: e.touches[0].clientY } : null); 
    };
    const end = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      const dropZone = document.elementsFromPoint(touch.clientX, touch.clientY).find(el => el.classList.contains('drop-zone'));
      if (dropZone) {
        const tLoc = dropZone.getAttribute('data-location') as any;
        const tIdx = parseInt(dropZone.getAttribute('data-index') || '0', 10);
        if (!(tLoc === dragState.source.location && tIdx === dragState.source.colIndex)) {
           const valid = tLoc === 'tableau' 
             ? isValidTableauMove(dragState.cards[0], gameState.columns[tIdx])
             : isValidFoundationMove(dragState.cards, gameState.foundation[tIdx]);
           if (valid) executeMove(dragState.source.location, dragState.source.colIndex, dragState.source.cardIndex, tLoc, tIdx);
           else triggerShake(dragState.cards[0].id);
        }
      }
      setDragState(null); setSelection(null);
    };
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', end);
    return () => { 
      window.removeEventListener('touchmove', move); 
      window.removeEventListener('touchend', end); 
    };
  }, [dragState, gameState, executeMove, triggerShake]);

  return { selection, setSelection, shakingCardId, dragState, handleCardClick, handleFoundationClick, handleDragStart, handleDrop, handleTouchStart };
};