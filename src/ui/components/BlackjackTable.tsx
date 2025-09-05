import type { GameState } from '../types/gameTypes';
import DealerArea from './DealerArea.tsx';
import PlayerArea from './PlayerArea.tsx';
import SidePanel from './SidePanel.tsx';
import GameActions from './GameActions.tsx';

interface BlackjackTableProps {
  gameState: GameState;
  onAction: (action: string, value?: number) => void;
}

const BlackjackTable: React.FC<BlackjackTableProps> = ({ gameState, onAction }) => {
  return (
    <>
      <div className="felt-table">
        <DealerArea dealer={gameState.dealer} />
        
        {gameState.message && (
          <div className={`game-message ${getMessageClass(gameState.message)}`}>
            {gameState.message}
          </div>
        )}
        
        <PlayerArea 
          player={gameState.player} 
          phase={gameState.phase}
          onAction={onAction}
        />
        
        <GameActions 
          gameState={gameState}
          onAction={onAction}
        />
      </div>
      
      <SidePanel gameState={gameState} />
    </>
  );
};

const getMessageClass = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes('win') || lowerMessage.includes('won')) return 'win';
  if (lowerMessage.includes('lose') || lowerMessage.includes('lost') || lowerMessage.includes('bust')) return 'loss';
  if (lowerMessage.includes('push') || lowerMessage.includes('tie')) return 'push';
  if (lowerMessage.includes('blackjack')) return 'blackjack';
  return '';
};

export default BlackjackTable;
