import "../css/list.scss";
import App from "./list/App";
import setup_react, { ProductOverview } from "./common";

export interface Data {
    products: {
        product_id: number,
        review_data: ProductOverview
    }[]
}

setup_react(App);