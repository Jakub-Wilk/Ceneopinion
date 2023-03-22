import React from "react";
import ReactDOM from "react-dom/client";

type App = (props?: any) => JSX.Element;

export interface ReviewData {
    "ID": Record<string, string | null>,
    "Username": Record<string, string | null>,
    "Recommended": Record<string, boolean | null>,
    "Stars": Record<string, number | null>,
    "Trusted": Record<string, boolean | null>,
    "Time Posted": Record<string, string | null>,
    "Time Bought": Record<string, string | null>,
    "Upvotes": Record<string, number | null>,
    "Downvotes": Record<string, number | null>,
    "Content": Record<string, string | null>,
    "Positives": Record<string, Array<string> | null>,
    "Negatives": Record<string, Array<string> | null>
}

function setup_react(app: App) {
    ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
        <React.StrictMode>
            {app()}
        </React.StrictMode>
    );
}

export default setup_react;