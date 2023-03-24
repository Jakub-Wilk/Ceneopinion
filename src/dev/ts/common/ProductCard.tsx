import { FaArrowCircleLeft, FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import Stars from "./Stars";

export enum CardType {
    Showcase,
    Chart,
    List
}

interface ProductCardProps {
    type: CardType
    name: string,
    photo_url: string,
    pros: number,
    cons: number,
    average: number
}

function ProductCard(props: ProductCardProps) {

    const chart_button = <div className="flex grow justify-center items-center">
        <a className="button" href={`${location.pathname}/charts`}>Zobacz wykresy</a>
    </div>;

    const chart_previous = location.pathname.substring(0, location.pathname.lastIndexOf("/"));

    return <div className="mt-8 flex rounded-2xl shadow-2xl border border-gray-300 p-4">
        <img src={props.photo_url}/>
        <div className="ml-8 flex flex-col justify-center">
            <div className="text-2xl mb-4">{props.name}</div>
            <div className="flex">
                <div className={`flex justify-center ${props.type == CardType.Showcase ? "flex-col items-start gap-1" : "items-center gap-3"}`}>
                    <div className="flex h-full"><FaThumbsUp className="translate-y-1 mr-2" color="#27ae60"/>Zalety: {props.pros}</div>
                    {props.type == CardType.Showcase ? null : <div>|</div>}
                    <div className="flex h-full"><FaThumbsDown className="translate-y-2 mr-2" color="#c0392b" />Wady: {props.cons}</div>
                    {props.type == CardType.Showcase ? null : <div>|</div>}
                    <div className={`flex h-full ${props.type == CardType.Showcase ? "flex-col" : null}`}>Średnia ocena: <Stars className="translate-y-1 ml-1" count={Math.round(props.average * 2) / 2}/></div>
                </div>
                {props.type == CardType.Showcase ? chart_button : null}
            </div>
        </div>
        { props.type == CardType.Chart
            ? <a href={`${chart_previous}`} className="relative right-0 w-6 h-6"><FaArrowCircleLeft color="#FF6400" className="h-full w-full"/></a>
            : null
        }
    </div>;
}

export default ProductCard;