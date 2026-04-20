export default function ColorPicker({onPick}){
    return (
        <div className="color-picker-overlay">
            <div className="color-picker">
                <div className="color-options">
                    <button className="card-red color-btn" onClick={()=> onPick("red")}></button>
                    <button className="card-yellow color-btn" onClick={()=> onPick("yellow")}></button>
                    <button className="card-green color-btn" onClick={()=> onPick("green")}></button>
                    <button className="card-blue color-btn" onClick={()=> onPick("blue")}></button>
                </div>
            </div>
        </div>
    )
}