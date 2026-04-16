import Card from "./Card"

export default function Board({ drawPile, discardPile, topCard, drawCard }){
    return (
        <div className="board">
            <div className="draw-pile">
                <button onClick={drawCard} className="draw-button">
                    Draw Card ({drawPile.length} left)
                </button>
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