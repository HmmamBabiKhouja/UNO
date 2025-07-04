import Reverse from "../SVG/retrun-cleaned.svg?react"
import Skip from "../SVG/road-sign-arrow-svgrepo-com.svg?react"
import ColorChange from "../SVG/download.svg?react"

export default function Card({color, value}) {
    let displayValue = value;
    const isSkip = value === "skip";
    const isReverse = value === "reverse"
    const isChangeColor = value === "wild"
    // const isDrawFour = value === "draw4"
    const isWild = color === "wild" 

    const WildCard =()=>(
        <div className="table-squares">
            <div className="square square-red"></div>
            <div className="square square-yellow"></div>
            <div className="square square-green"></div>
            <div className="square square-blue"></div>
        </div>
    )

    return (
        <div className={`card card-${color}`}>
            <div className="card-content">
                {isReverse && <div className="card-value"><Reverse className="card-icon"/></div>}
                {isSkip && <div className="card-value"><Skip className="card-icon"/></div>}
                {isChangeColor && <div className="card-value"><ColorChange className="card-icon"/></div>}
                {!isReverse && !isSkip && !isChangeColor && (<span className="card-value">{displayValue}</span>)}
                {isWild && <WildCard />}
            </div>
        </div>
    );
}