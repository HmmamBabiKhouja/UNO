import {useState, useEffect} from "react";
import {getNewShffledDeck} from "./component/utility/Deck";
import Card from "./component/Card"
import Board from "./component/Board"
import _default from "eslint-plugin-react-refresh";
import ColorPicker from "./component/ColorPicker";
import Hand from "./component/Hand"
import WinningScreen from "./component/WinningScreen";


export default function Game(){
    const [deck, setDeck] = useState([]);
    const [players, setPlayers] = useState([
        {
            id:0,
            name:"you",
            hand:[]
        },
        {
            id:1,
            name:"player 1",
            hand:[]
        },
        {
            id:2,
            name:"player 2",
            hand:[]
        },
        {
            id:3,
            name:"player 3",
            hand:[]
        }
    ])

    const [actionMsg, setActionMsg] = useState(null)
    const [direction, setDirection] = useState(1)
    const [drawPile, setDrawPile] = useState([]);
    const [discardPile, setDiscardPile] = useState([])
    const [currentColor, setCurrentColor] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState(0);
    const [showPicker, setShowPicker] = useState(false)
    const [backGroundColor, setBackGroundColor] = useState(null)
    const [showWinningScreen, setShowWinningScreen] = useState(false)
    const [winner, setWinner] = useState("")
    const topCard = discardPile[discardPile.length-1]

    useEffect(() =>{
        initGame();
    },[])

    const arrangeCards = (handCards)=>{
        const colors = ["blue", "green", "red", "yellow", "wild"]
        const newCards = []
        for(let c = 0; c<colors.length; c++){
            for(let i =0;i<handCards.length;i++){
                if(handCards[i].color===colors[c]) newCards.push(handCards[i])
            }
        }    
        return newCards
    }

    const showAction = (msg)=>{
        console.log(msg)
        setActionMsg(msg)
        setTimeout(() => setActionMsg(null), 1200)
    }

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

    const initGame = () => {
        const newDeck = getNewShffledDeck();
        const updatedPlayers = players.map((player, i)=> ({
            ...player,
            hand: arrangeCards(newDeck.slice(i*7, (i+1)*7))
        }))
        setPlayers(updatedPlayers)
        const remainingDeck = newDeck.slice(players.length*7);
        const firstCard = remainingDeck.pop();

        setDeck(newDeck);
        setShowWinningScreen(false);
        setWinner("");
        setShowPicker(false);

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
    }

    const resetCards = ()=>{
        initGame();
    }

    const playCard =(card, index, player)=>{
        console.log(player)
        const topCard = discardPile[discardPile.length-1]

        if(currentPlayer===player){
            if(card.color === currentColor ||
                card.value === topCard.value ||
                card.color === "wild"){
                const updatedPlayerHand = players[currentPlayer].hand.filter((_, i) => i!==index)
                const updatedPlayers = players.map((player, i)=>
                    i===currentPlayer? {...player,hand:updatedPlayerHand}: player
                )
                setPlayers(updatedPlayers)
                if(updatedPlayerHand.length===0){
                    setShowWinningScreen(true)
                    setWinner(players[currentPlayer].name)
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
                
                let newDirection = direction
                let steps =1;

                if(card.value === "+4"||card.value==="+2"){
                    const cardsToAdd = parseInt(card.value, 10)
                    // Draw 4 cards for the opponent
                    const cardsToDraw = drawPile.slice(-cardsToAdd);
                    setDrawPile(prev => prev.slice(0, -cardsToAdd));
                    const nextPlayerIndex = (currentPlayer+direction+players.length)%players.length
                    const updatedPlayersWithdraw = updatedPlayers.map((player, i)=>
                        i=== nextPlayerIndex? {...player, hand:[...player.hand, ...cardsToDraw]}:player)
                    setPlayers(updatedPlayersWithdraw);
                    steps=2;
                }    

                if(card.value === "skip"){
                    steps=2;
                    showAction("⛔ Skip!");
                }
                
                if(card.value === "reverse") {
                    // For 2 players, reverse acts like skip
                    if (players.length === 2) {
                        steps=2;
                    }else{
                        newDirection=-direction
                    }

                    showAction("🔄 Reverse!");
                }
                // Switch turns
                setDirection(newDirection);
                setCurrentPlayer(prev => (prev + newDirection * steps + players.length) % players.length);
            }
        }    
    }

    const getPlayerClass =(i) =>{
        if(i === 1) return "left"
        if(i === 2) return "top"
        if(i === 3) return "right"
        return "bottom"
    }
    const drawCard =()=>{
        if(drawPile.length=== 0){
            const newDeck = getNewShffledDeck();
            setDeck(newDeck);
            setDrawPile(newDeck);
        } 
        
        const drawnCard = drawPile[drawPile.length-1];
        const newCard = {
            ...drawnCard,
            isNew: true
        }

        setDrawPile(prev => prev.slice(0, -1))
        const updatedPlayers = players.map((player, i) =>
            i === currentPlayer ? { ...player, hand: arrangeCards([...player.hand, newCard]) } : player
        );

        setPlayers(updatedPlayers);
        const playerIndex = currentPlayer;
        setTimeout(() =>{

            setPlayers(prevPlayers => prevPlayers.map((player, i) =>
                
                i === playerIndex ? { ...player, hand: player.hand.map(card =>
                    card.isNew ? {...card, isNew: false} : card
                )} : player
            ));
        }, 600) 

        setCurrentPlayer((currentPlayer+direction+players.length)%players.length)
    }

    return (
        <div className={`game background-${backGroundColor}`}>
            {showPicker && <ColorPicker onPick={handleColorPicker}/>}
            {showWinningScreen && <WinningScreen winner={winner} onClick={resetCards}/>}            
            {actionMsg && <div className="action-popup">{actionMsg}</div>}
            <Hand 
                player={players[2]}
                className={`hand ${getPlayerClass(players[2].id)}`}
                onCardClick={(card, index)=> playCard(card, index,2)}
            />
            <div className="middle">
                <Hand 
                    player={players[1]}
                    className={`hand ${getPlayerClass(players[1].id)}`}
                    onCardClick={(card, index)=> playCard(card, index,1)}
                />
                <Board 
                    drawPile={drawPile} 
                    discardPile={discardPile} 
                    topCard={topCard} 
                    drawCard={drawCard} 
                />
                <Hand 
                    player={players[3]}
                    className={`hand ${getPlayerClass(players[3].id)}`}
                    onCardClick={(card, index)=> playCard(card, index,3)}
                />
            </div>
            <Hand 
                player={players[0]}
                className={`hand ${getPlayerClass(players[0].id)}`}
                onCardClick={(card, index)=> playCard(card, index,0)}
            />
        </div>
        
    )
}
