import Card from "./Card"

export default function Hand({ cards, className, onCardClick }) {
  return (
    <div className={` ${className}`}>
      {cards.map((card, index) => {
        const middle = cards.length/2;

        const rotation = (index - middle) * 3; // angle
        const offset = (index - middle) * 65 + 32.5; // spacing, adjusted to center
        const yOffset = Math.abs(index - middle) * 5;
        
        return (
          <div
            key={index}
            className="card-wrapper"
            style={{
              position: 'absolute',
              left: `calc(50% + ${offset}px)`,
              top: `calc(50% + ${yOffset}px)`,
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`
            }}
          >
            <Card 
              color={card.color}
              value={card.value}
              onClick={()=> onCardClick(card, index)}
            />
          </div>
        );
      })}
    </div>
  );
}