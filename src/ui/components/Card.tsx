import type { Card } from '../types/gameTypes';

interface CardComponentProps {
  card?: Card;
  isHidden?: boolean;
}

const CardComponent: React.FC<CardComponentProps> = ({ card, isHidden = false }) => {
  if (isHidden || !card) {
    return (
      <div className="card card-back">
        🂠
      </div>
    );
  }

  const suitSymbols: { [key: string]: string } = {
    'Hearts': '♥',
    'Diamonds': '♦',
    'Clubs': '♣',
    'Spades': '♠'
  };

  const displayRank = card.rank === '10' ? 'T' : card.rank;

  return (
    <div className={`card ${card.isRed ? 'red' : 'black'}`}>
      <div className="card-rank">{displayRank}</div>
      <div className="card-suit">{suitSymbols[card.suit] || card.suit}</div>
      <div className="card-rank" style={{ transform: 'rotate(180deg)' }}>
        {displayRank}
      </div>
    </div>
  );
};

export default CardComponent;
