import { Pie, Bar } from "react-chartjs-2";
import { Data } from "../charts";
import Navbar from "../common/Navbar";
import { NavbarOptions } from "../common/Navbar";
import ProductCard, { CardType } from "../common/ProductCard";

declare let data: Data;

function App() {

    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };

    return <>
        <Navbar selected={NavbarOptions.Extract}/>
        <div className="flex justify-center">
            <ProductCard 
                type={CardType.Chart}
                name={data.product_overview.product_name}
                photo_url={data.product_overview.photo_url}
                count={data.product_overview.review_count}
                pros={data.product_overview.pros_count}
                cons={data.product_overview.cons_count}
                average={data.product_overview.avg_rating}
            />
        </div>
        <div className="flex justify-center my-16">
            <div className="w-4/5 flex justify-evenly card">
                <div className="chart"><Pie data={data.pie} plugins={[]} options={options}/></div>
                <div className="chart"><Bar data={data.bar} plugins={[]} options={options}/></div>
            </div>
        </div>
        
    </>;
}

export default App;