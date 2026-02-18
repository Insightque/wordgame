
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
  foundation: ColumnData[]; // Slots for Master Cards
  stock: CardData[]; // Hidden pile
  waste: CardData[]; // Revealed pile
  actionPoints: number; // Remaining moves
  maxActionPoints: number; // For progress bar
  gameStatus: 'intro' | 'playing' | 'won' | 'lost';
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
