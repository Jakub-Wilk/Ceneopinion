import { Data } from "../product_details";
import ProductCard, { CardType } from "../common/ProductCard";

interface ProductGalleryProps {
    data: Data
}

function ProductGallery(props: ProductGalleryProps) {

    const product_overview = props.data.product_overview;

    return <div className="flex gap-8">
        <ProductCard
            type={CardType.Showcase}
            name={product_overview.product_name}
            photo_url={product_overview.photo_url}
            count={product_overview.review_count}
            pros={product_overview.pros_count}
            cons={product_overview.cons_count}
            average={product_overview.avg_rating}
        />
        <div className="mt-8 flex flex-col justify-evenly card">
            <div className="grid place-content-center text-xl">Eksport danych:</div>
            <a className="button" href={`${location.pathname}.csv`} download>Pobierz CSV</a>
            <a className="button" href={`${location.pathname}.xlsx`} download>Pobierz XLSX</a>
            <a className="button" href={`${location.pathname}.json`} download>Pobierz JSON</a>
        </div>
    </div>;
}

export default ProductGallery;