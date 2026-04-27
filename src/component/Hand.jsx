import Card from "./Card"

export default function Hand({ player, className, onCardClick }) {
  const cards = player.hand
  return (
    <div className={className}>
      {cards.map((card, index) => {
        return <Card 
          key={index}
          color={card.color}
          value={card.value}
          isNew={card.isNew}
          onClick={() => onCardClick(card, index)}
        />
      })}
    </div>
  );
}