import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { useState, useEffect } from "react";
import "react-circular-progressbar/dist/styles.css";
import AnimatedEllipsis from "./AnimatedEllipsis";

interface SpinnerProps {
    seconds: number,
    elapsed: number
}

function Spinner(props: SpinnerProps) {
    const [percentage, setPercentage] = useState(Math.min(props.elapsed / props.seconds * 100, 100));

    console.log(percentage, props.elapsed, props.seconds);

    if (percentage < 100) {
        setTimeout(() => {
            setPercentage(Math.min(percentage + 1, 100));
        }, (props.seconds / 100) * 1000);
    }
    
    return (
        <div className="flex flex-col items-center select-none">
            <div className="w-40 h-40">
                <CircularProgressbar value={percentage} text={`${Math.round(percentage)}%`} styles={ buildStyles({pathColor:"#FF6400", textColor:"#FF6400"}) }/>
            </div>
            <span className="mt-4 font-sans text-ceneo text-2xl">
                Ładowanie szczegółów produktu
                <AnimatedEllipsis />
            </span>
        </div>
    );
}

export default Spinner;