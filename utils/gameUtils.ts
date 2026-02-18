import { ALL_CATEGORIES, LEVEL_SETTINGS } from '../constants';
import { CardData, ColumnData } from '../types';

// --- Audio & Haptic ---
export const playSound = (type: 'pop' | 'tap' | 'error' | 'success' | 'shuffle' | 'win') => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;

  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);
  const now = ctx.currentTime;

  switch (type) {
    case 'pop':
      osc.type = 'triangle'; osc.frequency.setValueAtTime(300, now); osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
      gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now); osc.stop(now + 0.1); break;
    case 'tap':
      osc.type = 'sine'; osc.frequency.setValueAtTime(500, now);
      gain.gain.setValueAtTime(0.05, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now); osc.stop(now + 0.05); break;
    case 'error':
      osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, now); osc.frequency.linearRampToValueAtTime(100, now + 0.15);
      gain.gain.setValueAtTime(0.1, now); gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
      osc.start(now); osc.stop(now + 0.15); break;
    case 'success':
      osc.type = 'sine'; osc.frequency.setValueAtTime(500, now); osc.frequency.exponentialRampToValueAtTime(1000, now + 0.1);
      gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now); osc.stop(now + 0.3); break;
    case 'shuffle':
      osc.type = 'square'; osc.frequency.setValueAtTime(100, now);
      gain.gain.setValueAtTime(0.05, now); gain.gain.linearRampToValueAtTime(0, now + 0.2);
      osc.start(now); osc.stop(now + 0.2); break;
    case 'win':
      const melody = [523.25, 659.25, 783.99, 1046.50]; 
      melody.forEach((note, i) => {
        const oscN = ctx.createOscillator(); const gainN = ctx.createGain();
        oscN.connect(gainN); gainN.connect(ctx.destination);
        oscN.type = 'triangle'; oscN.frequency.setValueAtTime(note, now + i * 0.15);
        gainN.gain.setValueAtTime(0.1, now + i * 0.15); gainN.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.3);
        oscN.start(now + i * 0.15); oscN.stop(now + i * 0.15 + 0.4);
      }); break;
  }
};

export const triggerHaptic = (pattern: 'light' | 'heavy' | 'success' | 'error') => {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;
  switch (pattern) {
    case 'light': navigator.vibrate(5); break;
    case 'heavy': navigator.vibrate(15); break;
    case 'success': navigator.vibrate([10, 30, 10]); break;
    case 'error': navigator.vibrate([30, 50, 30]); break;
  }
};

// --- Helpers ---
export const generateId = () => Math.random().toString(36).substr(2, 9);
export const shuffle = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const getLevelSettings = (level: number) => {
  if (LEVEL_SETTINGS[level]) return LEVEL_SETTINGS[level];
  const targetCategories = 4 + (level - 1);
  const categories = Math.min(ALL_CATEGORIES.length, targetCategories); 
  return { label: `Lv.${level} 마스터`, categories: categories, turns: categories * 25, color: 'bg-purple-500' };
};

// --- Validation Logic ---
export const isValidTableauMove = (sourceCard: CardData, targetColumn: ColumnData): boolean => {
  if (targetColumn.length === 0) return true;
  const targetCard = targetColumn[targetColumn.length - 1];
  return sourceCard.category === targetCard.category;
};

export const isValidFoundationMove = (sourceCards: CardData[], targetSlot: ColumnData): boolean => {
  if (sourceCards.length === 0) return false;
  const first = sourceCards[0];
  if (first.type === 'master') return targetSlot.length === 0;
  if (targetSlot.length === 0) return false;
  const targetTop = targetSlot[targetSlot.length - 1];
  return targetTop.category === first.category;
};