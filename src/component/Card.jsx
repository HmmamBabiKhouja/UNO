import ReverseIcon from "../SVG/retrun-cleaned.svg?react"
import SkipIcon from "../SVG/road-sign-arrow-svgrepo-com.svg?react"
import WildIcon from "../SVG/download.svg?react"

export default function Card({color, value}) {
    const icons = {
        skip : SkipIcon,
        reverse : ReverseIcon,
        wild : WildIcon,
    };
    const Icon = icons[value];
    
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
                {Icon ?
                    (<div className="card-value">
                        <Icon className="card-icon"/>
                    </div>)
                    : 
                    (<span className="card-value">{value}</span>)
                }
                {isWild && <WildCard />}
            </div>
        </div>
    );
}