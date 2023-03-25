import Navbar from "../common/Navbar";
import { NavbarOptions } from "../common/Navbar";
import ProductCard, { CardType } from "../common/ProductCard";
import { Data } from "../list";

declare let data: Data;

function App() {

    const cards = [];

    for (const product of data.products) {
        const overview = product.review_data;
        cards.push(<ProductCard
            type={CardType.List}
            name={overview.product_name}
            photo_url={overview.photo_url}
            count={overview.review_count}
            pros={overview.pros_count}
            cons={overview.cons_count}
            average={overview.avg_rating}
            product_id={product.product_id}
            key={overview.product_name}
        />);
    }

    return (
        <>
            <Navbar selected={NavbarOptions.List}/>
            <div className="flex flex-col justify-start items-center">
                {cards}
            </div>
        </>
    );
}

export default App;