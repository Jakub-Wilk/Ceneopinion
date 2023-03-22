import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

interface StarsProps {
    count: number
}

function Stars(props: StarsProps) {
    const filled_stars = [...Array(Math.floor(props.count)).keys()].map(x => <FaStar color="#f39c12" key={x} />);
    const half_stars = [...Array(Math.ceil(props.count % 1)).keys()].map(x => <FaStarHalfAlt color="#f39c12" key={x}/>);
    const empty_stars = [...Array(Math.floor(5 - props.count)).keys()].map(x => <FaRegStar color="#f39c12" key={x}/>);

    return <span className="flex">{filled_stars}{half_stars}{empty_stars}</span>;
}

export default Stars;