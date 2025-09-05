import type { GameState } from '../types/gameTypes';

interface SidePanelProps {
  gameState: GameState;
}

const SidePanel: React.FC<SidePanelProps> = ({ gameState }) => {
  return (
    <div className="side-panel">
      <h3>Game Info</h3>
      <div className="game-stats">
        <div className="stat-item">
          <span className="stat-label">Hand #</span>
          <span className="stat-value">{gameState.handNumber}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Bankroll</span>
          <span className="stat-value">${gameState.player.stack}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Current Bet</span>
          <span className="stat-value">${gameState.player.totalBet}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Deck Penetration</span>
          <span className="stat-value">{(gameState.deckPenetration * 100).toFixed(1)}%</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Phase</span>
          <span className="stat-value">{gameState.phase}</span>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Quick Chips</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px' }}>
          <div className="chip chip-5">$5</div>
          <div className="chip chip-10">$10</div>
          <div className="chip chip-25">$25</div>
          <div className="chip chip-50">$50</div>
          <div className="chip chip-100">$100</div>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
