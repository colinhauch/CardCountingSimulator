import type { Database } from "./types/database";

// Card representation
export type Card = string; // e.g., "A of Hearts", "K of Spades"

// Game outcome types
export type HandOutcome = 'win' | 'loss' | 'push' | 'blackjack' | 'bust' | 'surrender';
export type PlayerActionType = 'hit' | 'stand' | 'double' | 'split' | 'surrender' | 'insurance';

// Game settings interface
export type GameSettings = Database['public']['Tables']['GameSettings']['Row'];

// Player information
export type Player = Database['public']['Tables']['Players']['Row'];

// Complete session structure
export type BlackjackSession = Database['public']['Tables']['BlackJackSessions']['Row'];

// Individual hand after splits
export interface PlayerHand {
  handIndex: number;
  cards: Card[];
  actions: PlayerActionType[];
  finalValue: number;
  outcome: HandOutcome;
  payout: number;
}

// Player's complete action for a hand
export interface PlayerAction {
  playerId: string;
  position: string;
  initialCards: [Card, Card];
  bet: number;
  insuranceBet: number;
  hands: PlayerHand[];
  totalBet: number;
  totalPayout: number;
  netResult: number;
}

// Dealer's hand information
export interface DealerHand {
  upCard: Card;
  holeCard: Card;
  finalHand: Card[];
  handValue: number;
  busted: boolean;
}

// Deck state tracking
export interface DeckState {
  cardsRemaining: number;
  shufflePoint: number;
  penetration: number;
}

// Complete hand record
export interface Hand {
  handNumber: number;
  dealer: DealerHand;
  playerActions: PlayerAction[];
  deckState: DeckState;
}

