import Card from "./Card"
import CardBack from "./utility/CardBack"

export default function Board({ drawPile, discardPile, topCard, drawCard }){
    return (
        <div className="board">
            <div className="draw-pile">
                <CardBack onClick={drawCard} className="draw-button">
                </CardBack>
            </div>
            <div className="discard-pile">
                {topCard && (
                    <div className="discard-card">
                        <Card
                        color={topCard.color}
                        value={topCard.value}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
