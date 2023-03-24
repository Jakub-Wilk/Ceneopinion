import "../css/charts.scss";
import App from "./charts/App";
import setup_react, { ProductOverview } from "./common";
import { Chart as ChartJS, Colors, BarElement, ArcElement, Tooltip, Legend, CategoryScale, LinearScale } from "chart.js";

interface ChartData {
    labels: string[],
    datasets: {
        label: string,
        data: number[]
    }[]
}

export interface Data {
    pie: ChartData
    bar: ChartData
    product_overview: ProductOverview
}

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Colors
);

setup_react(App);
