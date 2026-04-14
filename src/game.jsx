import {useState, useEffect} from "react";
import {getNewShffledDeck} from "./component/utility/Deck";
import Card from "./component/Card"
import Board from "./component/Board"
import _default from "eslint-plugin-react-refresh";
import ColorPicker from "./component/ColorPicker";


export default function Game(){
    const [deck, setDeck] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);
    const [compHand, setCompHand] = useState([])
    const [drawPile, setDrawPile] = useState([]);
    const [discardPile, setDiscardPile] = useState([])
    const [currentColor, setCurrentColor] = useState(null);
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [showPicker, setShowPicker] = useState(false)
    const [backGroundColor, setBackGroundColor] = useState([])
    const topCard = discardPile[discardPile.length-1]

    useEffect(() =>{
        const newDeck = getNewShffledDeck();
        const playerCards = newDeck.slice(0,7);
        const compCards = newDeck.slice(7, 14);
        const remainingDeck = newDeck.slice(14);
        const firstCard = remainingDeck.pop()

        setDeck(newDeck);
        setPlayerHand(playerCards);
        setCompHand(compCards);
        setDrawPile(remainingDeck)
        setDiscardPile([firstCard])
        setCurrentColor(firstCard.color === "wild" ? removeWildBeggin(firstCard): firstCard.color); 
        setBackGroundColor(firstCard.color)// default to red for wild
    },[])

    const handleColorPicker =(color)=>{
        setCurrentColor(color)
        setShowPicker(false)
        setBackGroundColor(color)
        
    }

    const removeWildBeggin =(card)=>{
        alert("hi")
        const randomIndex = Math.floor(Math.random() * drawPile.length);
        const newPile = [...drawPile];
        newPile[randomIndex]=card
        setDrawPile(newPile)
    }

    const playCard =(card, index, hand)=>{
        const topCard = discardPile[discardPile.length-1]
        
        if(card.color === currentColor ||
            card.value === topCard.value ||
            card.color === "wild"){
                if(hand==="player" && isPlayerTurn){
                    setPlayerHand(prev => prev.filter ((_, i) =>i!== index))
                }else if(hand==="computer" && !isPlayerTurn){
                    setCompHand(prev =>prev.filter((_,i)=>i!==index))
                }else{
                    return; // not your turn
                }

                setDiscardPile(prev => [...prev, card])
                // Handle special cards
                if(card.color === "wild" || card.value === "+4"){
                    setShowPicker(true)
                }
                if(card.value === "+4"){
                    // Draw 4 cards for the opponent
                    const cardsToDraw = drawPile.slice(-4);
                    setDrawPile(prev => prev.slice(0, -4));
                    if(hand === "player"){
                        setCompHand(prev => [...prev, ...cardsToDraw]);
                    }else{
                        setPlayerHand(prev => [...prev, ...cardsToDraw]);
                    }
                }

                // Switch turns
                setIsPlayerTurn(prev => !prev);
            }
    }

    const drawCard =()=>{
        if(drawPile.length=== 0){
            const newDeck = getNewShffledDeck();
            setDeck(newDeck);
        } 

        const newCard = drawPile[drawPile.length-1]

        setDrawPile(prev => prev.slice(0, -1))
        if(isPlayerTurn){
            setPlayerHand(prev=>[...prev, newCard])
            setIsPlayerTurn(false); // end turn after drawing
        }else if(!isPlayerTurn){
            setCompHand(prev=>[...prev, newCard])
            setIsPlayerTurn(true); // end turn after drawing
        }else{
            return
        }
    }

    return (
        <div className={`game background-${backGroundColor}`}>
            {showPicker && <ColorPicker onPick={handleColorPicker}/>}
            <div className="hand comp-hand">
                {compHand.map((card, index)=>(
                    <Card 
                        key={`${card.color}-${card.value}-${index}`}
                        color={card.color}
                        value={card.value}
                        onClick ={ ()=> playCard(card, index, "computer")}
                    />
                ))}
            </div>
            <Board 
                drawPile={drawPile} 
                discardPile={discardPile} 
                topCard={topCard} 
                drawCard={drawCard} 
            />
            <div className="hand player-hand">
                {playerHand.map((card, index)=>(
                    <Card
                    key={`${card.color}-${card.value}-${index}`}
                    color={card.color}
                    value={card.value}
                    onClick ={ ()=> playCard(card, index, "player")}
                    />
                ))}
            </div>
        </div>
        
    )
}