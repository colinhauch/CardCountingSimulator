import type { Card } from './types.js';

// Standard 52-card deck
const SUITS = ['Hearts', 'Diamonds', 'Clubs', 'Spades'] as const;
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;

export class Deck {
  private cards: Card[] = [];
  private usedCards: Card[] = [];

  constructor(numDecks: number = 6) {
    this.shuffle(numDecks);
  }

  private shuffle(numDecks: number): void {
    this.cards = [];
    this.usedCards = [];
    
    // Create multiple decks
    for (let d = 0; d < numDecks; d++) {
      for (const suit of SUITS) {
        for (const rank of RANKS) {
          this.cards.push(`${rank} of ${suit}`);
        }
      }
    }
    
    // Fisher-Yates shuffle
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = this.cards[i]!;
      this.cards[i] = this.cards[j]!;
      this.cards[j] = temp;
    }
  }

  deal(): Card {
    if (this.cards.length === 0) {
      throw new Error('Deck is empty');
    }
    const card = this.cards.pop()!;
    this.usedCards.push(card);
    return card;
  }

  get cardsRemaining(): number {
    return this.cards.length;
  }

  get penetration(): number {
    const totalCards = this.cards.length + this.usedCards.length;
    return this.usedCards.length / totalCards;
  }
}

export function getCardValue(card: Card): number {
  const rank = card.split(' ')[0];
  if (!rank) throw new Error(`Invalid card format: ${card}`);
  if (rank === 'A') return 11;
  if (['J', 'Q', 'K'].includes(rank)) return 10;
  return parseInt(rank);
}

export function calculateHandValue(cards: Card[]): { value: number; soft: boolean } {
  let value = 0;
  let aces = 0;
  
  for (const card of cards) {
    const cardValue = getCardValue(card);
    if (cardValue === 11) {
      aces++;
    }
    value += cardValue;
  }
  
  // Convert aces from 11 to 1 if needed
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }
  
  const soft = aces > 0 && value <= 11;
  return { value, soft };
}

export function isBlackjack(cards: Card[]): boolean {
  if (cards.length !== 2) return false;
  const { value } = calculateHandValue(cards);
  return value === 21;
}

export function canSplit(cards: Card[]): boolean {
  if (cards.length !== 2) return false;
  const rank1 = cards[0]?.split(' ')[0];
  const rank2 = cards[1]?.split(' ')[0];
  
  if (!rank1 || !rank2) return false;
  
  // Same rank or both 10-value cards
  return rank1 === rank2 || 
    (['10', 'J', 'Q', 'K'].includes(rank1) && ['10', 'J', 'Q', 'K'].includes(rank2));
}

export function canDouble(cards: Card[]): boolean {
  return cards.length === 2;
}

export function shouldDealerHit(cards: Card[], hitSoft17: boolean): boolean {
  const { value, soft } = calculateHandValue(cards);
  if (value < 17) return true;
  if (value > 17) return false;
  // Exactly 17
  return soft && hitSoft17;
}
