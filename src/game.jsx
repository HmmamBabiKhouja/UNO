import {useState, useEffect} from "react";
import {getNewShffledDeck} from "./component/utility/Deck";
import Card from "./component/Card"
import Board from "./component/Board"
import _default from "eslint-plugin-react-refresh";
import ColorPicker from "./component/ColorPicker";
import Hand from "./component/Hand"


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
        if(firstCard.color === "wild"){
            const initialColor = removeWildBeggin(firstCard, remainingDeck);
            setCurrentColor(initialColor);
            setBackGroundColor(initialColor);
        } else {
            setDrawPile(remainingDeck);
            setDiscardPile([firstCard]);
            setCurrentColor(firstCard.color);
            setBackGroundColor(firstCard.color);
        }
    },[])

    const handleColorPicker =(color)=>{
        setCurrentColor(color)
        setShowPicker(false)
        setBackGroundColor(color)
    }

    const removeWildBeggin =(card, pile)=>{
        const randomIndex = Math.floor(Math.random() * pile.length);
        const newPile = [...pile];
        const replacementCard = newPile[randomIndex];
        newPile[randomIndex] = card;
        setDrawPile(newPile);
        setDiscardPile([replacementCard]);
        return replacementCard.color;
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

                if(card.value===topCard.value){
                    setCurrentColor(card.color)
                    setBackGroundColor(card.color)
                }// update current color when cards played by value

                setDiscardPile(prev => [...prev, card])
                // Handle special cards
                if(card.color === "wild"){
                    setShowPicker(true)
                }
                
                if(card.value === "+4"||card.value==="+2"){
                    const cardsToAdd = parseInt(card.value, 10)
                    // Draw 4 cards for the opponent
                    const cardsToDraw = drawPile.slice(-cardsToAdd);
                    setDrawPile(prev => prev.slice(0, -cardsToAdd));
                    if(hand === "player"){
                        setCompHand(prev => [...prev, ...cardsToDraw]);
                    }else{
                        setPlayerHand(prev => [...prev, ...cardsToDraw]);
                    }
                }

                if(card.value === "skip") return
                //this is temp unitll making it 4 players
                if(card.value === "reverse") return 

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
            <Hand 
                className="hand comp-hand"
                cards={compHand}
                onCardClick={(card, index)=> playCard(card, index,"computer" )}
            />
            <Board 
                drawPile={drawPile} 
                discardPile={discardPile} 
                topCard={topCard} 
                drawCard={drawCard} 
            />
            <Hand 
                className="hand player-hand"
                cards={playerHand}
                onCardClick={(card, index)=> playCard(card, index, "player")}
            />
        </div>
        
    )
}