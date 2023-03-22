import { Data } from "../product_details";
import FilteringOptions from "./FilteringOptions";
import ReviewsTable from "./ReviewsTable";

interface ProductShowcaseProps {
    data: Data
}

function ProductShowcase(props: ProductShowcaseProps) {
    return <div>
        <FilteringOptions data={props.data}/>
        <div>
            <ReviewsTable data={props.data} />
        </div>
    </div>;
}

export default ProductShowcase;