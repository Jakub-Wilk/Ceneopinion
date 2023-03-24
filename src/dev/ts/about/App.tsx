import { useState } from "react";
import Navbar from "../common/Navbar";
import { NavbarOptions } from "../common/Navbar";

function App() {
    const [state, setState] = useState(0);

    return (
        <Navbar selected={NavbarOptions.About}/>
    );
}

export default App;