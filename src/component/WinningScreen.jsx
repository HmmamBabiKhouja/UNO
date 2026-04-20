export default function WinningScreen ({winner, onClick}){
    return (
        <div className="win-screen">
            <h3>{winner} is the winner </h3>
            <button onClick={onClick}>Play again?</button>
        </div>
    )
}