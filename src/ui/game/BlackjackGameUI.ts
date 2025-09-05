import type { GameState, Card, GameSettings, Player } from '../types/gameTypes';
import { Deck, calculateHandValue, isBlackjack, canSplit, canDouble } from '../../game-logic.js';
import type { Card as GameCard } from '../../types.js';

export class BlackjackGameUI {
  private deck: Deck;
  private gameSettings: GameSettings;
  private currentPlayer: Player;
  private setState: (state: GameState) => void;
  private gameState: GameState;

  constructor(gameSettings: GameSettings, players: Player[], setState: (state: GameState) => void) {
    console.log('BlackjackGameUI constructor called'); // Debug log
    this.deck = new Deck(gameSettings.numOfDecks);
    this.gameSettings = gameSettings;
    this.currentPlayer = players[0]!;
    this.setState = setState;
    
    this.gameState = {
      phase: 'betting',
      dealer: {
        cards: [],
        value: 0,
        isBlackjack: false,
        isBusted: false,
        showHoleCard: false
      },
      player: {
        hands: [{
          cards: [],
          value: 0,
          isBlackjack: false,
          isBusted: false,
          isComplete: false,
          bet: 0
        }],
        currentHandIndex: 0,
        stack: this.currentPlayer.currentStackSize,
        totalBet: 0
      },
      message: 'Place your bet to start!',
      availableActions: [],
      handNumber: 1,
      deckPenetration: this.deck.penetration
    };
    
    console.log('Initial game state:', this.gameState); // Debug log
    this.updateState();
  }

  private updateState(): void {
    console.log('updateState called, setting state to:', this.gameState); // Debug log
    this.setState({ ...this.gameState });
  }

  private convertCard(gameCard: GameCard): Card {
    const [rank, , , suit] = gameCard.split(' ');
    const isRed = suit === 'Hearts' || suit === 'Diamonds';
    
    let value = 0;
    if (rank === 'A') value = 11;
    else if (['J', 'Q', 'K'].includes(rank!)) value = 10;
    else value = parseInt(rank!);

    return {
      rank: rank!,
      suit: suit!,
      value,
      isRed
    };
  }

  placeBet(amount: number): void {
    console.log('placeBet called with amount:', amount, 'current phase:', this.gameState.phase); // Debug log
    if (this.gameState.phase !== 'betting') return;
    if (amount < this.gameSettings.minBet || amount > this.gameSettings.maxBet) return;
    if (amount > this.gameState.player.stack) return;

    this.gameState.player.hands[0]!.bet = amount;
    this.gameState.player.totalBet = amount;
    this.gameState.player.stack -= amount;
    this.gameState.phase = 'dealing';
    this.gameState.message = 'Bet placed! Click Deal Cards to start.';
    
    console.log('Bet placed, new game state:', this.gameState); // Debug log
    this.updateState();
  }

  dealCards(): void {
    if (this.gameState.phase !== 'dealing') return;

    // Deal initial cards
    const playerHand = this.gameState.player.hands[0]!;
    const dealerCards = [this.deck.deal(), this.deck.deal()];
    const playerCards = [this.deck.deal(), this.deck.deal()];

    // Convert cards for UI
    playerHand.cards = playerCards.map(card => this.convertCard(card));
    this.gameState.dealer.cards = dealerCards.map(card => this.convertCard(card));

    // Calculate values
    playerHand.value = calculateHandValue(playerCards).value;
    this.gameState.dealer.value = calculateHandValue(dealerCards).value;

    // Check for blackjacks
    playerHand.isBlackjack = isBlackjack(playerCards);
    this.gameState.dealer.isBlackjack = isBlackjack(dealerCards);

    this.gameState.deckPenetration = this.deck.penetration;

    if (playerHand.isBlackjack && this.gameState.dealer.isBlackjack) {
      this.gameState.dealer.showHoleCard = true;
      this.gameState.phase = 'complete';
      this.gameState.message = 'Both have blackjack! Push.';
      this.gameState.player.stack += playerHand.bet; // Return bet
    } else if (playerHand.isBlackjack) {
      this.gameState.dealer.showHoleCard = true;
      this.gameState.phase = 'complete';
      this.gameState.message = 'Blackjack! You win!';
      const payout = playerHand.bet + (playerHand.bet * this.gameSettings.payoutBlackjack);
      this.gameState.player.stack += payout;
    } else if (this.gameState.dealer.isBlackjack) {
      this.gameState.dealer.showHoleCard = true;
      this.gameState.phase = 'complete';
      this.gameState.message = 'Dealer has blackjack. You lose.';
    } else {
      this.gameState.phase = 'playing';
      this.gameState.message = 'Make your move!';
      this.updateAvailableActions();
    }

    this.updateState();
  }

  private updateAvailableActions(): void {
    const currentHand = this.gameState.player.hands[this.gameState.player.currentHandIndex]!;
    const actions: string[] = ['hit', 'stand'];

    // Can double on first two cards if player has enough money
    if (canDouble(currentHand.cards.map(c => `${c.rank} of ${c.suit}`)) && 
        this.gameState.player.stack >= currentHand.bet) {
      actions.push('double');
    }

    // Can split if cards can be split and player has enough money
    if (canSplit(currentHand.cards.map(c => `${c.rank} of ${c.suit}`)) && 
        this.gameState.player.stack >= currentHand.bet &&
        this.gameState.player.hands.length < this.gameSettings.maxSplits + 1) {
      actions.push('split');
    }

    // Can surrender on first two cards if allowed
    if (this.gameSettings.allowSurrender && currentHand.cards.length === 2) {
      actions.push('surrender');
    }

    this.gameState.availableActions = actions;
  }

  hit(): void {
    if (this.gameState.phase !== 'playing') return;

    const currentHand = this.gameState.player.hands[this.gameState.player.currentHandIndex]!;
    const newCard = this.deck.deal();
    const uiCard = this.convertCard(newCard);
    
    currentHand.cards.push(uiCard);
    
    const cardStrings = currentHand.cards.map(c => `${c.rank} of ${c.suit}`);
    currentHand.value = calculateHandValue(cardStrings).value;
    
    if (currentHand.value > 21) {
      currentHand.isBusted = true;
      currentHand.isComplete = true;
      this.checkNextHand();
    } else if (currentHand.value === 21) {
      currentHand.isComplete = true;
      this.checkNextHand();
    } else {
      this.updateAvailableActions();
    }

    this.gameState.deckPenetration = this.deck.penetration;
    this.updateState();
  }

  stand(): void {
    if (this.gameState.phase !== 'playing') return;

    const currentHand = this.gameState.player.hands[this.gameState.player.currentHandIndex]!;
    currentHand.isComplete = true;
    this.checkNextHand();
    this.updateState();
  }

  double(): void {
    if (this.gameState.phase !== 'playing') return;

    const currentHand = this.gameState.player.hands[this.gameState.player.currentHandIndex]!;
    
    // Deduct additional bet
    this.gameState.player.stack -= currentHand.bet;
    this.gameState.player.totalBet += currentHand.bet;
    currentHand.bet *= 2;

    // Deal one card
    const newCard = this.deck.deal();
    const uiCard = this.convertCard(newCard);
    currentHand.cards.push(uiCard);
    
    const cardStrings = currentHand.cards.map(c => `${c.rank} of ${c.suit}`);
    currentHand.value = calculateHandValue(cardStrings).value;
    
    if (currentHand.value > 21) {
      currentHand.isBusted = true;
    }
    
    currentHand.isComplete = true;
    this.checkNextHand();
    this.updateState();
  }

  split(): void {
    if (this.gameState.phase !== 'playing') return;

    const currentHand = this.gameState.player.hands[this.gameState.player.currentHandIndex]!;
    
    // Deduct additional bet
    this.gameState.player.stack -= currentHand.bet;
    this.gameState.player.totalBet += currentHand.bet;

    // Create new hand with second card
    const secondCard = currentHand.cards.pop()!;
    const newHand = {
      cards: [secondCard],
      value: secondCard.value,
      isBlackjack: false,
      isBusted: false,
      isComplete: false,
      bet: currentHand.bet
    };

    // Deal new cards to both hands
    const card1 = this.deck.deal();
    const card2 = this.deck.deal();
    
    currentHand.cards.push(this.convertCard(card1));
    newHand.cards.push(this.convertCard(card2));

    // Recalculate values
    currentHand.value = calculateHandValue(currentHand.cards.map(c => `${c.rank} of ${c.suit}`)).value;
    newHand.value = calculateHandValue(newHand.cards.map(c => `${c.rank} of ${c.suit}`)).value;

    // Insert new hand
    this.gameState.player.hands.splice(this.gameState.player.currentHandIndex + 1, 0, newHand);

    this.updateAvailableActions();
    this.updateState();
  }

  surrender(): void {
    if (this.gameState.phase !== 'playing') return;

    const currentHand = this.gameState.player.hands[this.gameState.player.currentHandIndex]!;
    
    // Return half the bet
    this.gameState.player.stack += currentHand.bet / 2;
    
    currentHand.isComplete = true;
    this.gameState.message = 'Surrendered. Half bet returned.';
    this.checkNextHand();
    this.updateState();
  }

  private checkNextHand(): void {
    // Check if current hand is complete and move to next
    if (this.gameState.player.currentHandIndex < this.gameState.player.hands.length - 1) {
      this.gameState.player.currentHandIndex++;
      this.updateAvailableActions();
      return;
    }

    // All hands complete, dealer plays
    this.playDealer();
  }

  private playDealer(): void {
    this.gameState.dealer.showHoleCard = true;
    this.gameState.phase = 'dealer';
    this.gameState.availableActions = [];

    // Check if dealer needs to hit
    const dealerCards = this.gameState.dealer.cards.map(c => `${c.rank} of ${c.suit}`);
    
    while (this.shouldDealerHit(dealerCards)) {
      const newCard = this.deck.deal();
      const uiCard = this.convertCard(newCard);
      this.gameState.dealer.cards.push(uiCard);
      dealerCards.push(`${uiCard.rank} of ${uiCard.suit}`);
      this.gameState.dealer.value = calculateHandValue(dealerCards).value;
    }

    if (this.gameState.dealer.value > 21) {
      this.gameState.dealer.isBusted = true;
    }

    this.resolveHands();
  }

  private shouldDealerHit(cards: string[]): boolean {
    const { value, soft } = calculateHandValue(cards);
    if (value < 17) return true;
    if (value > 17) return false;
    return soft && this.gameSettings.dealerHitsSoft17;
  }

  private resolveHands(): void {
    let totalWinnings = 0;
    const results: string[] = [];

    for (const hand of this.gameState.player.hands) {
      if (hand.isBusted) {
        results.push('Lost (Bust)');
      } else if (this.gameState.dealer.isBusted) {
        totalWinnings += hand.bet * 2;
        results.push('Won (Dealer Bust)');
      } else if (hand.value > this.gameState.dealer.value) {
        totalWinnings += hand.bet * 2;
        results.push('Won');
      } else if (hand.value < this.gameState.dealer.value) {
        results.push('Lost');
      } else {
        totalWinnings += hand.bet;
        results.push('Push');
      }
    }

    this.gameState.player.stack += totalWinnings;
    this.gameState.phase = 'complete';
    
    if (results.length === 1) {
      this.gameState.message = results[0]!;
    } else {
      this.gameState.message = `Results: ${results.join(', ')}`;
    }

    // Update player's actual stack size
    this.currentPlayer.currentStackSize = this.gameState.player.stack;
  }

  newHand(): void {
    // Check if deck needs shuffling
    if (this.deck.cardsRemaining < 20) {
      this.deck = new Deck(this.gameSettings.numOfDecks);
    }

    this.gameState = {
      phase: 'betting',
      dealer: {
        cards: [],
        value: 0,
        isBlackjack: false,
        isBusted: false,
        showHoleCard: false
      },
      player: {
        hands: [{
          cards: [],
          value: 0,
          isBlackjack: false,
          isBusted: false,
          isComplete: false,
          bet: 0
        }],
        currentHandIndex: 0,
        stack: this.currentPlayer.currentStackSize,
        totalBet: 0
      },
      message: 'Place your bet for the next hand!',
      availableActions: [],
      handNumber: this.gameState.handNumber + 1,
      deckPenetration: this.deck.penetration
    };

    this.updateState();
  }
}
