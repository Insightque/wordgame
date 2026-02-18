import { useState, useCallback, useEffect } from 'react';
import { GameState, CardData, ColumnData } from '../types';
import { ALL_CATEGORIES, TOTAL_COLUMNS } from '../constants';
import { generateId, shuffle, getLevelSettings, playSound, triggerHaptic, getSavedMaxLevel, saveMaxLevel, resetGameProgress, getSavedCoins, saveCoins } from '../utils/gameUtils';

export const useGameEngine = () => {
  const [maxReachedLevel, setMaxReachedLevel] = useState(1);
  const [totalCoins, setTotalCoins] = useState(0);
  const [gameState, setGameState] = useState<GameState>({
    level: 1, columns: [], foundation: [], stock: [], waste: [],
    actionPoints: 0, maxActionPoints: 0, gameStatus: 'intro'
  });
  const [totalWinCount, setTotalWinCount] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintedCardId, setHintedCardId] = useState<string | null>(null);

  // Load saved progress on mount
  useEffect(() => {
    setMaxReachedLevel(getSavedMaxLevel());
    setTotalCoins(getSavedCoins());
  }, []);

  const startGame = useCallback((level: number) => {
    playSound('shuffle');
    const settings = getLevelSettings(level);
    const shuffledCats = shuffle(ALL_CATEGORIES).slice(0, settings.categories);
    
    let deck: CardData[] = [];
    let winCount = 0;
    shuffledCats.forEach(cat => {
      deck.push({ id: generateId(), word: cat.label, category: cat.id, type: 'master', isFaceUp: false });
      winCount++; 
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
    setHintsUsed(0);
    setHintedCardId(null);
    setGameState({
      level, columns: newColumns, foundation: Array.from({ length: settings.categories }, () => []), 
      stock: deck.slice(cardIdx), waste: [], actionPoints: settings.turns, maxActionPoints: settings.turns, gameStatus: 'playing'
    });
  }, []);

  const resetAllData = useCallback(() => {
    resetGameProgress();
    setMaxReachedLevel(1);
    setTotalCoins(0);
    playSound('shuffle');
  }, []);

  const useHint = useCallback((selection: any) => {
    if (!selection || hintsUsed >= 3 || totalCoins < 20) {
      playSound('error');
      return;
    }

    let targetCard: CardData | null = null;
    if (selection.location === 'tableau') {
      targetCard = gameState.columns[selection.colIndex][selection.cardIndex];
    } else {
      targetCard = gameState.waste[gameState.waste.length - 1] || null;
    }

    if (targetCard) {
      setTotalCoins(prev => {
        const next = prev - 20;
        saveCoins(next);
        return next;
      });
      setHintsUsed(prev => prev + 1);
      setHintedCardId(targetCard.id);
      playSound('coin');
      // Auto-clear hint after 3 seconds
      setTimeout(() => setHintedCardId(null), 3000);
    } else {
      playSound('error');
    }
  }, [gameState, totalCoins, hintsUsed]);

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
    setHintedCardId(null); // Clear hint on any move
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
      
      // Save Max Level
      const nextLevel = gameState.level + 1;
      if (nextLevel > maxReachedLevel) {
        saveMaxLevel(nextLevel);
        setMaxReachedLevel(nextLevel);
      }

      // Add Coins (Remaining turns = coins)
      setTotalCoins(prev => {
        const next = prev + gameState.actionPoints;
        saveCoins(next);
        return next;
      });
    }
  }, [gameState.gameStatus, gameState.level, maxReachedLevel, gameState.actionPoints]);

  return { 
    gameState, setGameState, startGame, handleStockClick, executeMove, 
    totalWinCount, maxReachedLevel, resetAllData, totalCoins, useHint, hintsUsed, hintedCardId 
  };
};