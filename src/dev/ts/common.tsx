import React from "react";
import ReactDOM from "react-dom/client";

type App = (props?: any) => JSX.Element;

function setup_react(app: App) {
    ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
        <React.StrictMode>
            {app()}
        </React.StrictMode>
    );
}

export default setup_react;