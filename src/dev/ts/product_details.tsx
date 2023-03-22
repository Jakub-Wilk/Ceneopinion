import "../css/product_details.scss";
import App from "./product_details/App";
import setup_react from "./common";
import { ReviewData } from "./common";

interface TrueFalse {
    true: boolean,
    false: boolean
}

interface MinMax {
    min: number,
    max: number
}

interface DateMinMax {
    min: Date,
    max: Date
}

interface FilterData {
    "Stars": MinMax
    "Time Posted": DateMinMax,
    "Time Bought": DateMinMax,
    "Upvotes": MinMax,
    "Downvotes": MinMax
}

export interface Filters extends FilterData {
    "Recommended": TrueFalse,
    "Trusted": TrueFalse,
}

export interface Data {
    product_id: number,
    cooldown: number,
    delay: number | null,
    elapsed: number | null
    review_data: ReviewData,
    filter_data: FilterData
}

setup_react(App);