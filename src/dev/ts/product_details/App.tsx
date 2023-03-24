import Spinner from "./Spinner";
import Navbar from "../common/Navbar";
import { NavbarOptions } from "../common/Navbar";
import { Data } from "../product_details";
import ProductShowcase from "./ProductShowcase";

declare let data: Data;

function App() {
    let content: JSX.Element;

    if (data.delay === null) {
        content = <div>
            <ProductShowcase data={data} />
        </div>;
    } else {
        const seconds = data.delay * data.cooldown + 2;
        const elapsed = data.elapsed!;

        content = <div className="h-full w-full grid place-content-center">
            <Spinner seconds={seconds} elapsed={elapsed} />
        </div>;

        fetch(
            `/product/${data.product_id}`,
            {
                method: "POST"
            }
        )
            .then(response => response.json())
            .then(json => {
                const state = json["state"];
                if (["completed", "exists"].includes(state)) {
                    location.reload();
                } else {
                    setTimeout(() => location.reload(), seconds * 1000 - elapsed * 1000);
                }
            });
    }

    return (
        <div className="flex flex-col h-screen w-screen overflow-x-hidden">
            <Navbar selected={NavbarOptions.List} />
            <div className="h-full w-full">
                {content}
            </div>
        </div>
    );
}

export default App;