import { Data } from "../product_details";
import ReviewsTable from "./ReviewsTable";

interface ProductShowcaseProps {
    data: Data
}

function ProductShowcase(props: ProductShowcaseProps) {
    return <div>
        <div>
            <ReviewsTable data={props.data} />
        </div>
    </div>;
}

export default ProductShowcase;