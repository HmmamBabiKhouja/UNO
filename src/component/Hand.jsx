import Card from "./Card"
import CardBack from "./utility/CardBack";

export default function Hand({ player, className, onCardClick }) {
  const cards = player.hand
  return (
    <div className={className}>
      {cards.map((card, index) => {
        if(player.name==="you"){
          return <Card 
            key={index}
            color={card.color}
            value={card.value}
            isNew={card.isNew}
            onClick={() => onCardClick(card, index)}
          />
        }
        return <CardBack key={index}/>
      })}
    </div>
  );
}