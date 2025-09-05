// Types for the UI components
export interface Card {
  rank: string;
  suit: string;
  value: number;
  isRed: boolean;
}

export interface PlayerHand {
  cards: Card[];
  value: number;
  isBlackjack: boolean;
  isBusted: boolean;
  isComplete: boolean;
  bet: number;
}

export interface DealerHand {
  cards: Card[];
  value: number;
  isBlackjack: boolean;
  isBusted: boolean;
  showHoleCard: boolean;
}

export interface PlayerState {
  hands: PlayerHand[];
  currentHandIndex: number;
  stack: number;
  totalBet: number;
}

export interface GameState {
  phase: 'betting' | 'dealing' | 'playing' | 'dealer' | 'complete';
  dealer: DealerHand;
  player: PlayerState;
  message: string;
  availableActions: string[];
  handNumber: number;
  deckPenetration: number;
}

// Reuse types from your existing codebase
export interface GameSettings {
  gameType: 'Blackjack';
  minBet: number;
  maxBet: number;
  dealerHitsSoft17: boolean;
  numOfDecks: number;
  allowSurrender: boolean;
  allowDoubleAfterSplit: boolean;
  allowResplitAces: boolean;
  maxSplits: number;
  insuranceAllowed: boolean;
  payoutBlackjack: number;
  shuffleFrequency: string;
}

export interface Player {
  playerId: string;
  name: string;
  position: string;
  startingStackSize: number;
  currentStackSize: number;
}
