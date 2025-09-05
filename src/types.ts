// Card representation
export type Card = string; // e.g., "A of Hearts", "K of Spades"

// Game outcome types
export type HandOutcome = 'win' | 'loss' | 'push' | 'blackjack' | 'bust' | 'surrender';
export type PlayerActionType = 'hit' | 'stand' | 'double' | 'split' | 'surrender' | 'insurance';

// Game settings interface
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

// Player information
export interface Player {
  playerId: string;
  name: string;
  position: string;
  startingStackSize: number;
  currentStackSize: number;
}

// Individual hand after splits
export interface PlayerHand {
  handIndex: number;
  cards: Card[];
  actions: PlayerActionType[];
  finalValue: number;
  busted: boolean;
  blackjack: boolean;
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

// Complete session structure
export interface BlackjackSession {
  sessionId: string;
  totalHandsDealt: number;
  gameSettings: GameSettings;
  players: Player[];
  hands: Hand[];
}