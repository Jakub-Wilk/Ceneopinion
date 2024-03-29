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
    count: number,
    pros: number,
    cons: number,
    average: number,
    product_id?: number
}

function ProductCard(props: ProductCardProps) {

    const chart_button = <div className="flex grow justify-center items-center">
        <a
            className="button"
            href={props.type == CardType.List ? `/product/${props.product_id!}` : `${location.pathname}/charts`}
        >
            {props.type == CardType.List ? "Szczegóły" : "Zobacz wykresy"}
        </a>
    </div>;

    const chart_previous = location.pathname.substring(0, location.pathname.lastIndexOf("/"));

    return <div className="mt-8 flex justify-end card w-[50rem]">
        <img src={props.photo_url}/>
        <div className="ml-8 flex flex-col justify-center w-[35rem]">
            <a
                className={`text-2xl mb-4 ${props.type == CardType.List ? "" : "pointer-events-none"}`}
                title={props.name}
                href={props.type == CardType.List ? `/product/${props.product_id!}` : ""}
            >{props.name.length <= 40 ? props.name : props.name.slice(0, 37) + "..."}</a>
            <div className="flex">
                <div className={`flex justify-center ${[CardType.Showcase, CardType.List].includes(props.type) ? "flex-col items-start gap-1" : "items-center gap-3"}`}>
                    <div className="flex h-full">Liczba opinii: {props.count}</div>
                    {[CardType.Showcase, CardType.List].includes(props.type) ? null : <div>|</div>}
                    <div className="flex h-full"><FaThumbsUp className="translate-y-1 mr-2" color="#27ae60"/>Zalety: {props.pros}</div>
                    {[CardType.Showcase, CardType.List].includes(props.type) ? null : <div>|</div>}
                    <div className="flex h-full"><FaThumbsDown className="translate-y-2 mr-2" color="#c0392b" />Wady: {props.cons}</div>
                    {[CardType.Showcase, CardType.List].includes(props.type) ? null : <div>|</div>}
                    <div className={`flex h-full ${props.type == CardType.Showcase ? "flex-col" : null}`}>Średnia ocena: <Stars className="translate-y-1 ml-1" count={Math.round(props.average * 2) / 2}/></div>
                </div>
                {[CardType.Showcase, CardType.List].includes(props.type) ? chart_button : null}
            </div>
        </div>
        { [CardType.Showcase, CardType.Chart].includes(props.type)
            ? <a href={props.type == CardType.Chart ? chart_previous: "/product/list"} className="relative right-0 w-6 h-6"><FaArrowCircleLeft color="#FF6400" className="h-full w-full"/></a>
            : null
        }
    </div>;
}

export default ProductCard;