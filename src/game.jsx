import {useState, useEffect} from "react";
import {getNewShffledDeck} from "./component/utility/Deck";
import Card from "./component/Card"
import _default from "eslint-plugin-react-refresh";


export default function Game(){
    const [deck, setDeck] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);
    const [drawPile, setDrawPile] = useState([]);
    const [discardPile, setDiscardPile] = useState([])
    const topCard = discardPile[discardPile.length-1]

    useEffect(() =>{
        const newDeck = getNewShffledDeck();
        const playerCards = newDeck.slice(0,7)
        const remainingDeck = newDeck.slice(7);
        const firstCard = remainingDeck.pop()

        setDeck(newDeck);
        setDrawPile(remainingDeck)
        setDiscardPile(firstCard)
        setPlayerHand(playerCards);
    },[])

    const playCard =(card, index)=>{
        const topCard = discardPile(discardPile.length-1)

        if(card.color === topCard.color ||
            card.value === topCard.value ||
            card.value === "wild"){

                setPlayerHand(prev => prev.filter ((_, i) =>i!== index))

                setDiscardPile(prev => [...prev, card])
            }
    }

    const drawCard =()=>{
        if(drawPile.length=== 0) return 

        const newCard = drawPile(drawPile.length-1)

        setDrawPile(prev => prev.slice(0, -1))
        setPlayerHand(prev=>[...prev, newCard])
    }

    return (
        <div>

            <button onClick={drawCard}> darw</button>
            {topCard && (
                <Card 
                color={topCard.color}
                value={topCard.value}
                />
            )}

            <div className="hand">
                {playerHand.map((card, index)=>(
                    <Card
                    key={`${card.color}-${card.value}-${index}`}
                    color={card.color}
                    value={card.value}
                    onClick ={ ()=> playCard(card, index)}
                    />
                ))}
            </div>
        </div>
        
    )
}