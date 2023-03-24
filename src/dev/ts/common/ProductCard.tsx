import { FaThumbsDown, FaThumbsUp, FaUnderline } from "react-icons/fa";
import Stars from "./Stars";

interface ProductCardProps {
    chart?: boolean,
    name: string,
    photo_url: string,
    pros: number,
    cons: number,
    average: number
}

function ProductCard(props: ProductCardProps) {

    let chart;

    if (props.chart === undefined) {
        chart = false;
    } else {
        chart = props.chart;
    }

    const chart_button = <div className="flex grow justify-center items-center">
        <a className="button" href={`${location.pathname}/charts`}>Zobacz wykresy</a>
    </div>;

    return <div className="mt-8 flex rounded-2xl shadow-2xl border border-gray-300 p-4">
        <img src={props.photo_url}/>
        <div className="ml-8 flex flex-col justify-center">
            <div className="text-2xl mb-4">{props.name}</div>
            <div className="flex">
                <div className={`flex justify-center ${chart ? "flex-col items-start gap-1" : "items-center gap-3"}`}>
                    <div className="flex h-full"><FaThumbsUp className="translate-y-1 mr-2" color="#27ae60"/>Zalety: {props.pros}</div>
                    {chart ? null : <div>|</div>}
                    <div className="flex h-full"><FaThumbsDown className="translate-y-2 mr-2" color="#c0392b" />Wady: {props.cons}</div>
                    {chart ? null : <div>|</div>}
                    <div className={`flex h-full ${chart ? "flex-col" : null}`}>Średnia ocena: <Stars className="translate-y-1 ml-1" count={Math.round(props.average * 2) / 2}/></div>
                </div>
                {chart ? chart_button : null}
            </div>
        </div>
    </div>;
}

export default ProductCard;