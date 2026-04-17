export default function CardBack({ onClick, className }){
    return(
        <div className={`card back ${className || ''}`} onClick={onClick}>
            <div className="uno-logo">UNO</div>
        </div>
    )
}