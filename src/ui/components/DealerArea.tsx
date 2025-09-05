import type { DealerHand } from '../types/gameTypes';
import CardComponent from './Card.tsx';

interface DealerAreaProps {
  dealer: DealerHand;
}

const DealerArea: React.FC<DealerAreaProps> = ({ dealer }) => {
  return (
    <div className="dealer-area">
      <div className="dealer-label">Dealer</div>
      <div className="cards-container">
        {dealer.cards.map((card, index) => (
          <CardComponent 
            key={index} 
            card={card} 
            isHidden={index === 1 && !dealer.showHoleCard}
          />
        ))}
      </div>
      {dealer.showHoleCard && (
        <div className="hand-value">
          {dealer.value}
          {dealer.isBusted && ' - BUST!'}
          {dealer.isBlackjack && ' - BLACKJACK!'}
        </div>
      )}
    </div>
  );
};

export default DealerArea;
