import Navbar from "../common/Navbar";
import { NavbarOptions } from "../common/Navbar";
import Form from "./Component";

function App() {
    

    return (
        <div className="flex h-full flex-col">
            <Navbar selected={NavbarOptions.Extract}/>
            <div className="flex grow justify-center items-center">
                <Form />
            </div>
        </div>
    );
}

export default App;