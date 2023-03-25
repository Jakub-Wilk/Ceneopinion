import Navbar from "../common/Navbar";
import { NavbarOptions } from "../common/Navbar";

function App() {
    return (
        <div className="flex flex-col h-full">
            <Navbar selected={NavbarOptions.About}/>
            <div className="flex grow justify-center items-center">
                <div className="card max-w-2xl">
                    <div className="text-2xl mt-4">O autorze</div>
                    <p className="m-4">
                        Witam, na imię mi Jakub Wilk, mam 20 lat, oraz studiuję na Uniwersytecie Ekonomicznym w Krakowie.
                        Uczę się różnych form programowania od blisko 9 lat (choć wtedy był to tylko Scratch). Od kwietnia będę pracownikiem Nokii na stanowisku Working Student.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default App;