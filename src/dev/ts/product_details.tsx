import "../css/product_details.scss";
import App from "./product_details/App";
import setup_react from "./common";
import { ReviewData, ProductOverview } from "./common";

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
    stars: MinMax
    time_posted: DateMinMax,
    time_bought: DateMinMax,
    upvotes: MinMax,
    downvotes: MinMax
}

export interface Filters extends FilterData {
    recommended: TrueFalse,
    trusted: TrueFalse,
}

export interface Data {
    product_id: number,
    cooldown: number,
    elapsed: number | null,
    delay: number | null,
    review_data: ReviewData,
    filter_data: FilterData,
    product_overview: ProductOverview
}

setup_react(App);