import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

interface StarsProps {
    count: number,
    className?: string
}

function Stars(props: StarsProps) {
    let count = props.count;
    if (isNaN(props.count)) {
        count = 0;
    }
    const filled_stars = [...Array(Math.floor(count)).keys()].map(x => <FaStar color="#f39c12" key={x} />);
    const half_stars = [...Array(Math.ceil(count % 1)).keys()].map(x => <FaStarHalfAlt color="#f39c12" key={x}/>);
    const empty_stars = [...Array(Math.floor(5 - count)).keys()].map(x => <FaRegStar color="#f39c12" key={x}/>);

    return <span className={`flex ${props.className}`}>{filled_stars}{half_stars}{empty_stars}</span>;
}

export default Stars;