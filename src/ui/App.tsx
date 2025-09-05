import { useState, useEffect } from 'react';
import BlackjackTable from './components/BlackjackTable.tsx';
import type { GameState, Player, GameSettings } from './types/gameTypes';
import { BlackjackGameUI } from './game/BlackjackGameUI';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
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
      stack: 10000,
      totalBet: 0
    },
    message: 'Place your bet to start playing!',
    availableActions: [],
    handNumber: 1,
    deckPenetration: 0
  });

  const [game, setGame] = useState<BlackjackGameUI | null>(null);

  useEffect(() => {
    console.log('App useEffect running - initializing game'); // Debug log
    // Initialize game settings - these match your blackjack-rules.json
    const gameSettings: GameSettings = {
      gameType: 'Blackjack',
      minBet: 10,
      maxBet: 500,
      dealerHitsSoft17: true,
      numOfDecks: 6,
      allowSurrender: false,
      allowDoubleAfterSplit: true,
      allowResplitAces: false,
      maxSplits: 3,
      insuranceAllowed: true,
      payoutBlackjack: 1.5,
      shuffleFrequency: 'After every hand'
    };

    const player: Player = {
      playerId: 'player1',
      name: 'Player',
      position: 'seat1',
      startingStackSize: 10000,
      currentStackSize: 10000
    };

    console.log('Creating new BlackjackGameUI instance'); // Debug log
    const newGame = new BlackjackGameUI(gameSettings, [player], setGameState);
    setGame(newGame);
    console.log('Game initialized:', newGame); // Debug log
  }, []);

  const handleAction = (action: string, value?: number) => {
    console.log('handleAction called:', action, value); // Debug log
    if (!game) {
      console.log('Game not initialized yet'); // Debug log
      return;
    }
    
    switch (action) {
      case 'bet':
        if (value) {
          console.log('Placing bet:', value); // Debug log
          game.placeBet(value);
        }
        break;
      case 'deal':
        console.log('Dealing cards'); // Debug log
        game.dealCards();
        break;
      case 'hit':
        game.hit();
        break;
      case 'stand':
        game.stand();
        break;
      case 'double':
        game.double();
        break;
      case 'split':
        game.split();
        break;
      case 'surrender':
        game.surrender();
        break;
      case 'newGame':
        game.newHand();
        break;
    }
  };

  return (
    <div className="blackjack-table">
      <BlackjackTable 
        gameState={gameState} 
        onAction={handleAction}
      />
    </div>
  );
};

export default App;
