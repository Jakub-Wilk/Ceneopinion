import Navbar from "../common/Navbar";
import { NavbarOptions } from "../common/Navbar";

function App() {
    return (
        <Navbar selected={NavbarOptions.List}/>
    );
}

export default App;