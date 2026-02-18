import { useState, useCallback, useEffect } from 'react';
import { GameState, CardData, ColumnData } from '../types';
import { ALL_CATEGORIES, TOTAL_COLUMNS } from '../constants';
import { generateId, shuffle, getLevelSettings, playSound, triggerHaptic, getSavedMaxLevel, saveMaxLevel, resetGameProgress } from '../utils/gameUtils';

export const useGameEngine = () => {
  const [maxReachedLevel, setMaxReachedLevel] = useState(1);
  const [gameState, setGameState] = useState<GameState>({
    level: 1, columns: [], foundation: [], stock: [], waste: [],
    actionPoints: 0, maxActionPoints: 0, gameStatus: 'intro'
  });
  const [totalWinCount, setTotalWinCount] = useState(0);

  // Load saved progress on mount
  useEffect(() => {
    setMaxReachedLevel(getSavedMaxLevel());
  }, []);

  const startGame = useCallback((level: number) => {
    playSound('shuffle');
    const settings = getLevelSettings(level);
    const shuffledCats = shuffle(ALL_CATEGORIES).slice(0, settings.categories);
    
    let deck: CardData[] = [];
    let winCount = 0;
    shuffledCats.forEach(cat => {
      // Master Card
      deck.push({ id: generateId(), word: cat.label, category: cat.id, type: 'master', isFaceUp: false });
      winCount++; 
      
      // Randomly select 5 words from the category
      const selectedWords = shuffle(cat.words).slice(0, 5);
      
      selectedWords.forEach(word => {
        deck.push({ id: generateId(), word: word, category: cat.id, type: 'word', isFaceUp: false });
        winCount++;
      });
    });

    deck = shuffle(deck);
    const newColumns: ColumnData[] = Array.from({ length: TOTAL_COLUMNS }, () => []);
    let cardIdx = 0;
    const tableauSize = Math.floor(deck.length * 0.6); 
    
    for (let i = 0; i < tableauSize; i++) {
      newColumns[i % TOTAL_COLUMNS].push(deck[cardIdx++]);
    }
    newColumns.forEach(col => { if (col.length > 0) col[col.length - 1].isFaceUp = true; });

    setTotalWinCount(winCount);
    setGameState({
      level, columns: newColumns, foundation: Array.from({ length: settings.categories }, () => []), 
      stock: deck.slice(cardIdx), waste: [], actionPoints: settings.turns, maxActionPoints: settings.turns, gameStatus: 'playing'
    });
  }, []);

  const resetAllData = useCallback(() => {
    resetGameProgress();
    setMaxReachedLevel(1);
    playSound('shuffle'); // Just a feedback sound
  }, []);

  const handleStockClick = () => {
    if (gameState.gameStatus !== 'playing') return;
    playSound('pop'); triggerHaptic('light');

    if (gameState.stock.length > 0) {
      setGameState(prev => {
        const newStock = [...prev.stock];
        const card = newStock.pop();
        if (!card) return prev;
        card.isFaceUp = true;
        return { ...prev, stock: newStock, waste: [...prev.waste, card], actionPoints: prev.actionPoints - 1, gameStatus: (prev.actionPoints - 1 <= 0) ? 'lost' : 'playing' };
      });
    } else if (gameState.waste.length > 0) {
      setGameState(prev => {
        const newStock = [...prev.waste].reverse().map(c => ({...c, isFaceUp: false}));
        return { ...prev, stock: newStock, waste: [], actionPoints: prev.actionPoints - 1, gameStatus: (prev.actionPoints - 1 <= 0) ? 'lost' : 'playing' };
      });
    }
  };

  const executeMove = (sourceLoc: 'tableau' | 'waste', sourceColIdx: number, sourceCardIdx: number, targetLoc: 'tableau' | 'foundation', targetIdx: number) => {
    playSound('success'); triggerHaptic('success');
    setGameState(prev => {
      const newColumns = prev.columns.map(c => [...c]);
      const newFoundation = prev.foundation.map(c => [...c]);
      const newWaste = [...prev.waste];
      let movingCards: CardData[] = [];

      if (sourceLoc === 'tableau') {
        movingCards = newColumns[sourceColIdx].slice(sourceCardIdx);
        newColumns[sourceColIdx] = newColumns[sourceColIdx].slice(0, sourceCardIdx);
        const len = newColumns[sourceColIdx].length;
        if (len > 0) newColumns[sourceColIdx][len - 1].isFaceUp = true;
      } else {
        const card = newWaste.pop();
        if (card) movingCards = [card];
      }

      if (targetLoc === 'tableau') newColumns[targetIdx] = [...newColumns[targetIdx], ...movingCards];
      else newFoundation[targetIdx] = [...newFoundation[targetIdx], ...movingCards];

      let nextAP = prev.actionPoints - 1;
      const totalCards = newFoundation.reduce((sum, col) => sum + col.length, 0);
      let nextStatus = prev.gameStatus;
      if (totalCards >= totalWinCount) nextStatus = 'won';
      else if (nextAP <= 0) nextStatus = 'lost';

      return { ...prev, columns: newColumns, foundation: newFoundation, waste: newWaste, actionPoints: nextAP, gameStatus: nextStatus };
    });
  };

  // Check for win and save progress
  useEffect(() => {
    if (gameState.gameStatus === 'won') {
      playSound('win');
      triggerHaptic('success');
      const nextLevel = gameState.level + 1;
      if (nextLevel > maxReachedLevel) {
        saveMaxLevel(nextLevel);
        setMaxReachedLevel(nextLevel);
      }
    }
  }, [gameState.gameStatus, gameState.level, maxReachedLevel]);

  return { gameState, setGameState, startGame, handleStockClick, executeMove, totalWinCount, maxReachedLevel, resetAllData };
};