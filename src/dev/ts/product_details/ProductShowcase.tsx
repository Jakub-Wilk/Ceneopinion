import { Data } from "../product_details";
import FilteringOptions from "./FilteringOptions";
import ProductGallery from "./ProductGallery";
import ReviewsTable from "./ReviewsTable";

interface ProductShowcaseProps {
    data: Data
}

function ProductShowcase(props: ProductShowcaseProps) {
    return <div className="flex flex-col items-center">
        <ProductGallery data={props.data} />
        <FilteringOptions data={props.data}/>
        <div>
            <ReviewsTable data={props.data} />
        </div>
    </div>;
}

export default ProductShowcase;