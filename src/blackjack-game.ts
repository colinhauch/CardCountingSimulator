import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import type { 
  BlackjackSession, 
  Hand, 
  PlayerAction, 
  PlayerHand, 
  DealerHand, 
  GameSettings,
  Player,
  PlayerActionType
} from './types.js';
import { 
  Deck, 
  calculateHandValue, 
  isBlackjack, 
  canSplit, 
  canDouble, 
  shouldDealerHit 
} from './game-logic.js';
import { saveSessionToFile } from './session-utils';
import { copyGameSettings } from './config-loader.js';

export class BlackjackGame {
  private deck: Deck;
  private session: BlackjackSession;
  private rl: readline.Interface;
  private currentHandNumber = 1;

  constructor(gameSettings: GameSettings, players: Player[]) {
    this.deck = new Deck(gameSettings.numOfDecks);
    this.rl = readline.createInterface({ input, output });
    
    this.session = {
      sessionId: `session_${Date.now()}`,
      totalHandsDealt: 0,
      gameSettings: copyGameSettings(gameSettings), // Create a copy for the session
      players,
      hands: []
    };
  }

  async playSession(): Promise<void> {
    console.log(`\nHello ${this.session.players[0]?.name}! You start with $${this.session.players[0]?.currentStackSize}`);
    console.log('Type "quit" at any time to end the session\n');

    let continueGame = true;
    while (continueGame) {
      try {
        await this.playHand();
        this.currentHandNumber++;
        
        const answer = await this.rl.question('\nPlay another hand? (y/n): ');
        continueGame = answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
      } catch (error) {
        if (error instanceof Error && error.message === 'quit') {
          continueGame = false;
        } else {
          console.error('Error during hand:', error);
          continueGame = false;
        }
      }
    }

    await this.endSession();
  }

  private async playHand(): Promise<void> {
    console.log(`\n=== Hand ${this.currentHandNumber} ===`);
    
    // Check if deck needs shuffling
    if (this.deck.cardsRemaining < 20) {
      console.log('🔄 Shuffling deck...');
      this.deck = new Deck(this.session.gameSettings.numOfDecks);
    }

    // First, collect all bets from players
    const playerBets: Map<string, number> = new Map();
    for (const player of this.session.players) {
      const bet = await this.getBet(player);
      playerBets.set(player.playerId, bet);
    }

    // Now deal the dealer's cards (but only show one)
    const dealerHand = await this.dealDealerHand();

    const hand: Hand = {
      handNumber: this.currentHandNumber,
      dealer: dealerHand,
      playerActions: [],
      deckState: {
        cardsRemaining: this.deck.cardsRemaining,
        shufflePoint: 52,
        penetration: this.deck.penetration
      }
    };

    // Deal to each player and play their hands
    for (const player of this.session.players) {
      const bet = playerBets.get(player.playerId)!;
      const playerAction = await this.playPlayerHand(player, hand.dealer.upCard, bet);
      hand.playerActions.push(playerAction);
    }

    // Dealer plays
    await this.playDealerHand(hand.dealer);
    
    // Determine outcomes
    this.determineOutcomes(hand);
    
    // Update player stacks
    this.updatePlayerStacks(hand);
    
    // Save hand to session
    this.session.hands.push(hand);
    this.session.totalHandsDealt++;
    
    // Display results
    this.displayHandResults(hand);
  }

  private async dealDealerHand(): Promise<DealerHand> {
    const upCard = this.deck.deal();
    const holeCard = this.deck.deal();
    
    console.log(`Dealer shows: ${upCard}`);
    
    return {
      upCard,
      holeCard,
      finalHand: [upCard, holeCard],
      handValue: calculateHandValue([upCard, holeCard]).value,
      busted: false
    };
  }

  private async playPlayerHand(player: Player, _dealerUpCard: string, bet: number): Promise<PlayerAction> {
    console.log(`\n--- ${player.name}'s turn ---`);
    console.log(`Bet placed: $${bet}`);
    
    const initialCards: [string, string] = [this.deck.deal(), this.deck.deal()];
    
    console.log(`${player.name}'s cards: ${initialCards.join(', ')}`);
    console.log(`Hand value: ${calculateHandValue(initialCards).value}`);
    
    const hands: PlayerHand[] = [];
    
    // Check for blackjack
    if (isBlackjack(initialCards)) {
      console.log('🎉 BLACKJACK!');
      hands.push({
        handIndex: 0,
        cards: initialCards,
        actions: [],
        finalValue: 21,
        busted: false,
        blackjack: true,
        outcome: 'blackjack',
        payout: 0 // Will be calculated later
      });
    } else {
      // Play the hand(s)
      const hand = await this.playIndividualHand(initialCards, 0, player, bet);
      hands.push(hand);
      
      // Handle splits if they occurred
      let handIndex = 1;
      while (hands.some(h => h.actions.includes('split')) && handIndex < hands.length + 1) {
        // This is simplified - in a real implementation you'd need to track split cards
        handIndex++;
      }
    }

    return {
      playerId: player.playerId,
      position: player.position,
      initialCards,
      bet,
      insuranceBet: 0, // Simplified - no insurance for now
      hands,
      totalBet: bet * hands.length,
      totalPayout: 0, // Will be calculated later
      netResult: 0 // Will be calculated later
    };
  }

  private async playIndividualHand(
    cards: string[], 
    handIndex: number, 
    player: Player, 
    bet: number
  ): Promise<PlayerHand> {
    const actions: PlayerActionType[] = [];
    let currentCards = [...cards];
    
    while (true) {
      const handValue = calculateHandValue(currentCards);
      
      if (handValue.value > 21) {
        console.log('💥 BUST!');
        return {
          handIndex,
          cards: currentCards,
          actions,
          finalValue: handValue.value,
          busted: true,
          blackjack: false,
          outcome: 'bust',
          payout: 0
        };
      }
      
      if (handValue.value === 21) {
        console.log('✨ 21!');
        break;
      }
      
      // Get player action
      const availableActions = this.getAvailableActions(currentCards, bet, player.currentStackSize);
      const actionInput = await this.getPlayerAction(availableActions);
      
      if (actionInput === 'quit') {
        throw new Error('quit');
      }
      
      const action = actionInput as PlayerActionType;
      actions.push(action);
      
      switch (action) {
        case 'hit':
          const newCard = this.deck.deal();
          currentCards.push(newCard);
          console.log(`Hit: ${newCard}`);
          console.log(`Hand: ${currentCards.join(', ')}`);
          console.log(`Value: ${calculateHandValue(currentCards).value}`);
          break;
          
        case 'stand':
          console.log('Standing');
          return {
            handIndex,
            cards: currentCards,
            actions,
            finalValue: handValue.value,
            busted: false,
            blackjack: false,
            outcome: 'win', // Will be determined later
            payout: 0
          };
          
        case 'double':
          const doubleCard = this.deck.deal();
          currentCards.push(doubleCard);
          console.log(`Double down: ${doubleCard}`);
          console.log(`Final hand: ${currentCards.join(', ')}`);
          console.log(`Value: ${calculateHandValue(currentCards).value}`);
          
          const finalValue = calculateHandValue(currentCards);
          return {
            handIndex,
            cards: currentCards,
            actions,
            finalValue: finalValue.value,
            busted: finalValue.value > 21,
            blackjack: false,
            outcome: finalValue.value > 21 ? 'bust' : 'win', // Will be determined later
            payout: 0
          };
          
        default:
          console.log('Action not implemented yet');
          break;
      }
    }
    
    const finalValue = calculateHandValue(currentCards);
    return {
      handIndex,
      cards: currentCards,
      actions,
      finalValue: finalValue.value,
      busted: false,
      blackjack: false,
      outcome: 'win', // Will be determined later
      payout: 0
    };
  }

  private getAvailableActions(cards: string[], bet: number, stackSize: number): string[] {
    const actions = ['hit', 'stand'];
    
    if (canDouble(cards) && stackSize >= bet) {
      actions.push('double');
    }
    
    if (canSplit(cards) && stackSize >= bet) {
      actions.push('split');
    }
    
    if (this.session.gameSettings.allowSurrender && cards.length === 2) {
      actions.push('surrender');
    }
    
    return actions;
  }

  private async getPlayerAction(availableActions: string[]): Promise<string> {
    while (true) {
      const prompt = `Choose action (${availableActions.join(', ')}, quit): `;
      const action = await this.rl.question(prompt);
      
      if (action === 'quit' || availableActions.includes(action)) {
        return action;
      }
      
      console.log('Invalid action. Please try again.');
    }
  }

  private async getBet(player: Player): Promise<number> {
    while (true) {
      const prompt = `${player.name} (Stack: $${player.currentStackSize}) - Enter bet ($${this.session.gameSettings.minBet}-$${this.session.gameSettings.maxBet}): `;
      const betStr = await this.rl.question(prompt);
      
      if (betStr === 'quit') throw new Error('quit');
      
      const bet = parseInt(betStr);
      
      if (isNaN(bet)) {
        console.log('Please enter a valid number');
        continue;
      }
      
      if (bet < this.session.gameSettings.minBet || bet > this.session.gameSettings.maxBet) {
        console.log(`Bet must be between $${this.session.gameSettings.minBet} and $${this.session.gameSettings.maxBet}`);
        continue;
      }
      
      if (bet > player.currentStackSize) {
        console.log('Insufficient funds');
        continue;
      }
      
      return bet;
    }
  }

  private async playDealerHand(dealer: DealerHand): Promise<void> {
    console.log(`\nDealer's hole card: ${dealer.holeCard}`);
    console.log(`Dealer's hand: ${dealer.finalHand.join(', ')}`);
    console.log(`Dealer's value: ${dealer.handValue}`);
    
    if (isBlackjack(dealer.finalHand)) {
      console.log('🃏 Dealer has blackjack!');
      return;
    }
    
    while (shouldDealerHit(dealer.finalHand, this.session.gameSettings.dealerHitsSoft17)) {
      const newCard = this.deck.deal();
      dealer.finalHand.push(newCard);
      dealer.handValue = calculateHandValue(dealer.finalHand).value;
      
      console.log(`Dealer hits: ${newCard}`);
      console.log(`Dealer's hand: ${dealer.finalHand.join(', ')}`);
      console.log(`Dealer's value: ${dealer.handValue}`);
      
      if (dealer.handValue > 21) {
        dealer.busted = true;
        console.log('💥 Dealer busts!');
        break;
      }
    }
    
    if (!dealer.busted && dealer.handValue <= 21) {
      console.log(`Dealer stands on ${dealer.handValue}`);
    }
  }

  private determineOutcomes(hand: Hand): void {
    for (const playerAction of hand.playerActions) {
      for (const playerHand of playerAction.hands) {
        if (playerHand.busted) {
          playerHand.outcome = 'bust';
          playerHand.payout = 0;
        } else if (playerHand.blackjack && !isBlackjack(hand.dealer.finalHand)) {
          playerHand.outcome = 'blackjack';
          playerHand.payout = playerAction.bet + (playerAction.bet * this.session.gameSettings.payoutBlackjack);
        } else if (hand.dealer.busted) {
          playerHand.outcome = 'win';
          playerHand.payout = playerAction.bet * 2; // Return bet + winnings
        } else if (playerHand.finalValue > hand.dealer.handValue) {
          playerHand.outcome = 'win';
          playerHand.payout = playerAction.bet * 2; // Return bet + winnings
        } else if (playerHand.finalValue < hand.dealer.handValue) {
          playerHand.outcome = 'loss';
          playerHand.payout = 0;
        } else {
          playerHand.outcome = 'push';
          playerHand.payout = playerAction.bet; // Return original bet
        }
      }
      
      // Calculate totals
      playerAction.totalPayout = playerAction.hands.reduce((sum, h) => sum + h.payout, 0);
      playerAction.netResult = playerAction.totalPayout - playerAction.totalBet;
    }
  }

  private updatePlayerStacks(hand: Hand): void {
    for (const playerAction of hand.playerActions) {
      const player = this.session.players.find(p => p.playerId === playerAction.playerId)!;
      player.currentStackSize += playerAction.netResult;
    }
  }

  private displayHandResults(hand: Hand): void {
    console.log('\n=== HAND RESULTS ===');
    console.log(`Dealer: ${hand.dealer.finalHand.join(', ')} (${hand.dealer.handValue})${hand.dealer.busted ? ' BUST' : ''}`);
    
    for (const playerAction of hand.playerActions) {
      const player = this.session.players.find(p => p.playerId === playerAction.playerId)!;
      console.log(`\n${player.name}:`);
      
      for (const playerHand of playerAction.hands) {
        const outcomeEmoji = {
          'win': '✅',
          'loss': '❌', 
          'push': '🤝',
          'blackjack': '🎉',
          'bust': '💥',
          'surrender': '🏳️'
        }[playerHand.outcome] || '❓';
        
        console.log(`  ${playerHand.cards.join(', ')} (${playerHand.finalValue}) ${outcomeEmoji} ${playerHand.outcome.toUpperCase()}`);
        console.log(`  Bet: $${playerAction.bet}, Payout: $${playerHand.payout}, Net: ${playerAction.netResult >= 0 ? '+' : ''}$${playerAction.netResult}`);
      }
      console.log(`  New stack: $${player.currentStackSize}`);
    }
  }

  private async endSession(): Promise<void> {
    console.log('\n🎲 Session ended!');
    
    // Display final results
    console.log('\n=== FINAL RESULTS ===');
    for (const player of this.session.players) {
      const netChange = player.currentStackSize - player.startingStackSize;
      console.log(`${player.name}: $${player.startingStackSize} → $${player.currentStackSize} (${netChange >= 0 ? '+' : ''}$${netChange})`);
    }
    
    // Save session to file
    const filename = `session_${this.session.sessionId}_${new Date().toISOString().split('T')[0]}.json`;
    try {
      await saveSessionToFile(this.session, filename);
      console.log(`\n💾 Session saved to ${filename}`);
    } catch (error) {
      console.error('Failed to save session:', error);
    }
    
    this.rl.close();
  }
}
