import {useState, useEffect, useRef} from "react";
import {getNewShuffledDeck} from "./component/utility/Deck";
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
        // {
        //     id:2,
        //     name:"player 2",
        //     hand:[]
        // },
        // {
        //     id:3,
        //     name:"player 3",
        //     hand:[]
        // }
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
    const opponentMemory = useRef({
        colorLack: { red: 0, blue: 0, green: 0, yellow: 0 }
    }).current;

    useEffect(() =>{
        initGame();
    },[])

    useEffect(() =>{
        if(players[currentPlayer]?.name !=="you"){
            const timer = setTimeout(() => {
                const opponentIndex = (currentPlayer - direction + players.length)% players.length;
                const move =bestMove(
                    players[currentPlayer].hand,
                    players[opponentIndex].hand,
                );

                if(!move){
                    drawCard();
                    return
                }

                playCard(move.card, move.index, currentPlayer);

                if(move.color){
                    handleColorPicker(move.color)
                }
            }, 1000);
            
            return () => clearTimeout(timer)
        }
    },[currentPlayer, players, direction])

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

    const updateOpponentLack=({playedCard, drewCard})=>{
        if(drewCard){
            opponentMemory.colorLack[currentColor]+=2;
        }

        if(playedCard){
            opponentMemory.colorLack[currentColor]-=1;
        }
    }

    const bestMove = (curr, opponent) =>{

        const possibleCards = curr;
        const colorCount = possibleCards.reduce((acc, card)=>{ acc[card.color]=(acc[card.color]||0)+1; return acc },{})
        const colors = Object.keys(colorCount).filter(card=> card!== "wild");
        const mostColor=colors.length?colors.reduce((a, b) => colorCount[a] > colorCount[b]? a : b):currentColor;

        const validCards = curr.filter((card)=>
            card.color===currentColor||
            card.value===topCard.value||
            card.value==="wild"
        );

        if(validCards.length === 0) return null;
        
        const pickBestColor = () =>{
            const colors = ["red", "blue", "green", "yellow"]

            return colors.reduce((best, color)=>{

                const my = colorCount[color]|| 0
                const oppo = opponentMemory.colorLack[color]|| 0

                const score = my*2 + oppo*3;
                
                return score > (best.score || -Infinity)
                    ? { color, score }
                    : best;
            }, {}).color;
        }

        const getScore = (card) => {
            let score = 0;

            const isOffColor = currentColor !== mostColor;
            const opponentClose = opponent.length <= 2;

            // 🏁 Endgame
            if (curr.length <= 2) {
                if (card.value === "+4") score += 10;  // strongest attack
                if (card.value === "+2") score += 8;
                if (card.value === "skip") score += 9;
            }

            if (!opponentClose) {
                if (card.value === "+2") score -= 2;
                if (card.value === "skip") score -= 2;
            }

            // 💥 Attack (no stacking now)
            if (card.value === "+4"){
                if(opponentClose) score+=12;
                else if( curr.length <=2) score+=10;
                else score +=7
            }
            if (card.value === "+2") score += opponentClose ? 8 : 5;

            // ⛔ Control
            if (card.value === "skip") score += opponentClose ? 9 : 5;
            if (card.value === "reverse") score += 3;

            // 🎯 Matching
            if (card.color === currentColor) score += 4;
            if (card.value === topCard.value) score += 3;

            // 🎨 Stay in strong color
            if (card.color === mostColor && currentColor === mostColor) {
                score += 3;
            }

            // 😈 Target opponent weakness
            if (opponentMemory.colorLack[card.color] > 2) {
                score += 6;
            }

            // 🃏 Wild logic (no stacking version)
            if (card.color === "wild") {
                if (curr.length <= 2) score += 10;      // secure win
                else if (isOffColor) score += 7;        // fix bad color
                else score -= 3;                        // save it
            }

            return score;
        };

        let bestIndex = 0;
        let bestScore =-Infinity;

        validCards.forEach((card, i)=>{
            const score = getScore(card)
            if(score>bestScore){
                bestScore=score
                bestIndex=i
            }
        })
            
        const chosenCard = validCards[bestIndex];

        return {
            index: curr.indexOf(chosenCard),
            card: chosenCard,
            color: chosenCard.color === "wild" ? pickBestColor() : null
        };
    }

    const showAction = (msg)=>{
        setActionMsg(msg)
        setTimeout(() => setActionMsg(null), 1200)
    }

    const handleColorPicker =(color)=>{
        setCurrentColor(color)
        setShowPicker(false)
        setBackGroundColor(color)
    }

    const removeWildBegin =(card, pile)=>{
        const randomIndex = Math.floor(Math.random() * pile.length);
        const newPile = [...pile];
        const replacementCard = newPile[randomIndex];
        newPile[randomIndex] = card;
        setDrawPile(newPile);
        setDiscardPile([replacementCard]);
        return replacementCard.color;
    }

    const initGame = () => {
        const newDeck = getNewShuffledDeck();
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
            const initialColor = removeWildBegin(firstCard, remainingDeck);
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
                if(card.color === "wild" && players[currentPlayer].name === "you"){
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
        if(i === 1) return "top"
        // if(i === 2) return "top"
        // if(i === 3) return "right"
        return "bottom"
    }

    const drawCard =()=>{
        if(drawPile.length=== 0){
            const newDeck = getNewShuffledDeck();
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

        const nextPlayer = (currentPlayer+direction+players.length)%players.length
        setCurrentPlayer(nextPlayer)
    }

    return (
        <div className={`game background-${backGroundColor}`}>
            {showPicker && <ColorPicker onPick={handleColorPicker}/>}
            {showWinningScreen && <WinningScreen winner={winner} onClick={resetCards}/>}            
            {actionMsg && <div className="action-popup">{actionMsg}</div>}
            <Hand 
                player={players[1]}
                className={`hand ${getPlayerClass(players[1].id)}`}
                // onCardClick={(card, index)=> playCard(card, index,1)}
            />
            <div className="middle">
                {/* <Hand 
                    player={players[1]}
                    className={`hand ${getPlayerClass(players[1].id)}`}
                    onCardClick={(card, index)=> playCard(card, index,1)}
                /> */}
                <Board 
                    drawPile={drawPile} 
                    discardPile={discardPile} 
                    topCard={topCard} 
                    drawCard={drawCard} 
                />
                {/* <Hand 
                    player={players[3]}
                    className={`hand ${getPlayerClass(players[3].id)}`}
                    onCardClick={(card, index)=> playCard(card, index,3)}
                /> */}
            </div>
            <Hand 
                player={players[0]}
                className={`hand ${getPlayerClass(players[0].id)}`}
                onCardClick={(card, index)=> playCard(card, index,0)}
            />
        </div>
        
    )
}
