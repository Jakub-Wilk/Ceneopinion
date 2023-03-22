import "../css/product_details.scss";
import App from "./product_details/App";
import setup_react from "./common";
import { ReviewData } from "./common";
export interface Data {
    product_id: number,
    cooldown: number,
    delay: number | null,
    elapsed: number | null
    review_data: ReviewData,
    filter_data: FilterData
}

setup_react(App);