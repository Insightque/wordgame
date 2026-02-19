export type CardType = 'master' | 'word';

export interface CardData {
  id: string;
  word: string;
  category: string;
  type: CardType;
  isFaceUp: boolean;
}

// A column is just an array of cards
export type ColumnData = CardData[];

export interface GameState {
  level: number;
  columns: ColumnData[]; // Tableau
  foundation: ColumnData[]; // Slots for Master Cards (Working areas)
  stock: CardData[]; // Hidden pile
  waste: CardData[]; // Revealed pile
  actionPoints: number; // Remaining moves
  maxActionPoints: number; // For progress bar
  gameStatus: 'intro' | 'playing' | 'won' | 'lost';
  categoryTargets?: Record<string, number>; // Maps category ID to total cards (1 master + N words)
  completedCategoriesCount: number; // Number of categories fully cleared
}

export interface Selection {
  location: 'tableau' | 'waste';
  colIndex: number; // For tableau (0-4), for waste (0)
  cardIndex: number; // Index in the stack
}

export interface DragState {
  isActive: boolean;
  cards: CardData[];
  source: Selection;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  width: number;
}