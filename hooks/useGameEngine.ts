import { useState, useCallback, useEffect } from 'react';
import { GameState, CardData, ColumnData } from '../types';
import { ALL_CATEGORIES, TOTAL_COLUMNS } from '../constants';
import { generateId, shuffle, getLevelSettings, playSound, triggerHaptic, getSavedMaxLevel, saveMaxLevel, resetGameProgress, getSavedCoins, saveCoins } from '../utils/gameUtils';

export const useGameEngine = () => {
  const [maxReachedLevel, setMaxReachedLevel] = useState(1);
  const [totalCoins, setTotalCoins] = useState(0);
  const [gameState, setGameState] = useState<GameState>({
    level: 1, columns: [], foundation: [], stock: [], waste: [],
    actionPoints: 0, maxActionPoints: 0, gameStatus: 'intro',
    categoryTargets: {}, completedCategoriesCount: 0
  });
  const [totalCategoriesInLevel, setTotalCategoriesInLevel] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintedCardId, setHintedCardId] = useState<string | null>(null);

  useEffect(() => {
    setMaxReachedLevel(getSavedMaxLevel());
    setTotalCoins(getSavedCoins());
  }, []);

  const startGame = useCallback((level: number) => {
    playSound('shuffle');
    const settings = getLevelSettings(level);
    const shuffledCats = shuffle(ALL_CATEGORIES).slice(0, settings.categories);
    setTotalCategoriesInLevel(settings.categories);
    
    let deck: CardData[] = [];
    const categoryTargets: Record<string, number> = {};

    shuffledCats.forEach(cat => {
      deck.push({ id: generateId(), word: cat.label, category: cat.id, type: 'master', isFaceUp: false });
      
      const baseMin = 3;
      const levelBonus = Math.floor(level / 8);
      const currentMin = Math.min(5, baseMin + levelBonus);
      const currentMax = Math.min(8, currentMin + 3);
      const wordCount = Math.floor(Math.random() * (currentMax - currentMin + 1)) + currentMin;
      
      const selectedWords = shuffle(cat.words).slice(0, wordCount);
      selectedWords.forEach(word => {
        deck.push({ id: generateId(), word: word, category: cat.id, type: 'word', isFaceUp: false });
      });

      categoryTargets[cat.id] = 1 + wordCount;
    });

    deck = shuffle(deck);
    const newColumns: ColumnData[] = Array.from({ length: TOTAL_COLUMNS }, () => []);
    let cardIdx = 0;
    
    const tableauSize = Math.floor(deck.length * 0.6); 
    for (let i = 0; i < tableauSize; i++) {
      newColumns[i % TOTAL_COLUMNS].push(deck[cardIdx++]);
    }
    newColumns.forEach(col => { if (col.length > 0) col[col.length - 1].isFaceUp = true; });

    setHintsUsed(0);
    setHintedCardId(null);
    setGameState({
      level, 
      columns: newColumns, 
      // 재단 슬롯은 항상 4개로 유지하여 전략적인 배치를 유도합니다.
      foundation: Array.from({ length: 4 }, () => []), 
      stock: deck.slice(cardIdx), 
      waste: [], 
      actionPoints: settings.turns, 
      maxActionPoints: settings.turns, 
      gameStatus: 'playing',
      categoryTargets,
      completedCategoriesCount: 0
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
        const nextAP = prev.actionPoints - 1;
        return { ...prev, stock: newStock, waste: [...prev.waste, card], actionPoints: nextAP, gameStatus: nextAP <= 0 ? 'lost' : 'playing' };
      });
    } else if (gameState.waste.length > 0) {
      setGameState(prev => {
        const newStock = [...prev.waste].reverse().map(c => ({...c, isFaceUp: false}));
        const nextAP = prev.actionPoints - 1;
        return { ...prev, stock: newStock, waste: [], actionPoints: nextAP, gameStatus: nextAP <= 0 ? 'lost' : 'playing' };
      });
    }
  };

  const executeMove = (sourceLoc: 'tableau' | 'waste', sourceColIdx: number, sourceCardIdx: number, targetLoc: 'tableau' | 'foundation', targetIdx: number) => {
    setHintedCardId(null);
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

      if (targetLoc === 'tableau') {
        newColumns[targetIdx] = [...newColumns[targetIdx], ...movingCards];
        playSound('tap');
      } else {
        newFoundation[targetIdx] = [...newFoundation[targetIdx], ...movingCards];
        playSound('success');
      }

      // 완성 체크 로직
      let nextCompletedCount = prev.completedCategoriesCount;
      if (targetLoc === 'foundation') {
        const catId = newFoundation[targetIdx][0].category;
        const target = prev.categoryTargets?.[catId] || 999;
        if (newFoundation[targetIdx].length >= target) {
          // 카테고리 완성! 슬롯을 비우고 카운트 증가
          newFoundation[targetIdx] = [];
          nextCompletedCount += 1;
          playSound('win');
          triggerHaptic('success');
        }
      }

      let nextAP = prev.actionPoints - 1;
      let nextStatus = prev.gameStatus;
      if (nextCompletedCount >= totalCategoriesInLevel) nextStatus = 'won';
      else if (nextAP <= 0) nextStatus = 'lost';

      return { 
        ...prev, 
        columns: newColumns, 
        foundation: newFoundation, 
        waste: newWaste, 
        actionPoints: nextAP, 
        gameStatus: nextStatus,
        completedCategoriesCount: nextCompletedCount
      };
    });
  };

  useEffect(() => {
    if (gameState.gameStatus === 'won') {
      const nextLevel = gameState.level + 1;
      if (nextLevel > maxReachedLevel) {
        saveMaxLevel(nextLevel);
        setMaxReachedLevel(nextLevel);
      }
      setTotalCoins(prev => {
        const next = prev + gameState.actionPoints;
        saveCoins(next);
        return next;
      });
    }
  }, [gameState.gameStatus, gameState.level, maxReachedLevel, gameState.actionPoints]);

  return { 
    gameState, setGameState, startGame, handleStockClick, executeMove, 
    totalCategoriesInLevel, maxReachedLevel, resetAllData, totalCoins, useHint, hintsUsed, hintedCardId 
  };
};