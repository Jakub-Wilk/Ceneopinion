import "../css/extract.scss";
import App from "./extract/App";
import setup_react from "./common";

export interface Data {
    show_error: boolean
}

setup_react(App);