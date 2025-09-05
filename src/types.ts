import type { Database } from "./types/database";

// Card representation
export type Card = Database['public']['Enums']['Card'];

// Game outcome types
export type HandOutcome = Database['public']['Enums']['HandOutcome'];

// Actions a player can take
export type PlayerAction = Database['public']['Enums']['PlayerAction'];

// Game settings interface
export type GameSettings = Database['public']['Tables']['GameSettings']['Row'];

// Player information
export type Player = Database['public']['Tables']['Players']['Row'];

// Complete session structure
export type BlackjackSession = Database['public']['Tables']['BlackJackSessions']['Row'];

// Individual hand after splits
export type PlayerHand = Database['public']['Tables']['PlayerHands']['Row'];

// Player's complete action for a hand
export type PlayerTurn = Database['public']['Tables']['PlayerTurns']['Row'];

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
  playerActions: PlayerTurn[];
  deckState: DeckState;
}

