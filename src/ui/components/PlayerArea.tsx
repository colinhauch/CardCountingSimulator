import { useState } from 'react';
import type { ChangeEvent } from 'react';
import type { PlayerState } from '../types/gameTypes';
import CardComponent from './Card.tsx';

interface PlayerAreaProps {
  player: PlayerState;
  phase: string;
  onAction: (action: string, value?: number) => void;
}

const PlayerArea: React.FC<PlayerAreaProps> = ({ player, phase, onAction }) => {
  const currentHand = player.hands[player.currentHandIndex];
  const [betAmount, setBetAmount] = useState<number>(10);

  const handleBetChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setBetAmount(value);
  };

  const handlePlaceBet = () => {
    console.log('handlePlaceBet called with betAmount:', betAmount); // Debug log
    onAction('bet', betAmount);
  };

  const handleDeal = () => {
    console.log('handleDeal called'); // Debug log
    onAction('deal');
  };

  return (
    <div className="player-area">
      <div className="player-info">
        <div className="player-name">Player</div>
        <div className="player-stack">Stack: ${player.stack}</div>
        {currentHand && currentHand.bet > 0 && (
          <div className="player-bet">Bet: ${currentHand.bet}</div>
        )}
      </div>

      {phase === 'betting' && (
        <div className="betting-area">
          <input
            type="number"
            value={betAmount}
            onChange={handleBetChange}
            onFocus={() => console.log('Input focused')}
            onMouseEnter={() => console.log('Mouse entered input')}
            min="10"
            max="500"
            className="bet-input"
            placeholder="Bet amount"
          />
          <button 
            className="bet-button" 
            onClick={handlePlaceBet}
            onMouseEnter={() => console.log('Mouse entered Place Bet button')}
            onMouseLeave={() => console.log('Mouse left Place Bet button')}
            disabled={betAmount < 10 || betAmount > 500 || betAmount > player.stack}
          >
            Place Bet
          </button>
        </div>
      )}

      {phase === 'dealing' && (
        <div className="betting-area">
          <button className="new-game-button" onClick={handleDeal}>
            Deal Cards
          </button>
        </div>
      )}

      {currentHand && currentHand.cards.length > 0 && (
        <>
          <div className="cards-container">
            {currentHand.cards.map((card, index) => (
              <CardComponent key={index} card={card} />
            ))}
          </div>
          <div className="hand-value">
            {currentHand.value}
            {currentHand.isBusted && ' - BUST!'}
            {currentHand.isBlackjack && ' - BLACKJACK!'}
          </div>
        </>
      )}

      {player.hands.length > 1 && (
        <div className="split-hands-info">
          Playing hand {player.currentHandIndex + 1} of {player.hands.length}
        </div>
      )}
    </div>
  );
};

export default PlayerArea;
