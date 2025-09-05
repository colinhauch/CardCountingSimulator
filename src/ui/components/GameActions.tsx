import type { GameState } from '../types/gameTypes';

interface GameActionsProps {
  gameState: GameState;
  onAction: (action: string) => void;
}

const GameActions: React.FC<GameActionsProps> = ({ gameState, onAction }) => {
  if (gameState.phase !== 'playing' || gameState.availableActions.length === 0) {
    if (gameState.phase === 'complete') {
      return (
        <div className="game-actions">
          <button 
            className="new-game-button" 
            onClick={() => onAction('newGame')}
          >
            New Hand
          </button>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="game-actions">
      {gameState.availableActions.includes('hit') && (
        <button 
          className="action-button hit" 
          onClick={() => onAction('hit')}
        >
          Hit
        </button>
      )}
      
      {gameState.availableActions.includes('stand') && (
        <button 
          className="action-button stand" 
          onClick={() => onAction('stand')}
        >
          Stand
        </button>
      )}
      
      {gameState.availableActions.includes('double') && (
        <button 
          className="action-button double" 
          onClick={() => onAction('double')}
        >
          Double Down
        </button>
      )}
      
      {gameState.availableActions.includes('split') && (
        <button 
          className="action-button split" 
          onClick={() => onAction('split')}
        >
          Split
        </button>
      )}
      
      {gameState.availableActions.includes('surrender') && (
        <button 
          className="action-button surrender" 
          onClick={() => onAction('surrender')}
        >
          Surrender
        </button>
      )}
    </div>
  );
};

export default GameActions;
