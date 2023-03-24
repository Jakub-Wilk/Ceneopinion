import React from "react";
import ReactDOM from "react-dom/client";

type App = (props?: any) => JSX.Element;

export interface ProductOverview {
    photo_url: string,
    product_name: string,
    review_count: number,
    pros_count: number,
    cons_count: number,
    avg_rating: number
}

export interface ReviewData {
    id: Record<string, string | null>,
    username: Record<string, string | null>,
    recommended: Record<string, boolean | null>,
    stars: Record<string, number | null>,
    trusted: Record<string, boolean | null>,
    time_posted: Record<string, string | null>,
    time_bought: Record<string, string | null>,
    upvotes: Record<string, number | null>,
    downvotes: Record<string, number | null>,
    content: Record<string, string | null>,
    positives: Record<string, Array<string> | null>,
    negatives: Record<string, Array<string> | null>
}

function setup_react(app: App) {
    ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
        <React.StrictMode>
            {app()}
        </React.StrictMode>
    );
}

export default setup_react;