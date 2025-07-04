import ReverseIcon from "../SVG/retrun-cleaned.svg?react"
import SkipIcon from "../SVG/road-sign-arrow-svgrepo-com.svg?react"
import WildIcon from "../SVG/download.svg?react"

export default function Card({color, value}) {
    const isWild = color === "wild" 
    let displayValue = value;
    const isSkip = value === "skip";
    const isReverse = value === "reverse"
    const isChangeColor = value === "wild"
    const isNumberCard = !isReverse && !isSkip && !isChangeColor;

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
                {isReverse && <div className="card-value"><ReverseIcon className="card-icon"/></div>}
                {isSkip && <div className="card-value"><SkipIcon className="card-icon"/></div>}
                {isChangeColor && <div className="card-value"><WildIcon className="card-icon"/></div>}
                {isNumberCard && (<span className="card-value">{displayValue}</span>)}
                {isWild && <WildCard />}
            </div>
        </div>
    );
}