import { FormEvent, useState } from "react";
import { Data } from "../extract";


declare let data: Data;

function Form() {
    const [error, setError] = useState(data.show_error ? "Nie znaleziono produktu!" : "");

    const submit_handler = (e: FormEvent) => {
        const input = document.querySelector("input");
        if (input) {
            const value = input.value;
            if (isNaN(+value) || value == "") {
                setError("Wartość musi być cyfrą!");
                e.preventDefault();
            }
        }
    };

    return <div className="rounded-2xl shadow-2xl border border-gray-300 p-4 w-2/5 h-1/3">
        <form className="flex flex-col justify-evenly items-center h-full w-full" method="GET" onSubmit={submit_handler}>
            <input type="number" name="pid" placeholder="Wpisz id produktu..." />
            <button type="submit" className="button">Ekstraktuj</button>
            <div className="absolute bottom-1/3 text-red-700 text-xl">{error}</div>
        </form>
    </div>;
}

export default Form;