import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { ReviewData } from "../common";
import { Data } from "../product_details";
import Stars from "./Stars";

interface DataRowProps {
    row_number: number,
    data: Data,
    headers: string[] 
}

function DataRow(props: DataRowProps) {

    const cells = [];

    for (const header of props.headers) {
        const data_extracted = props.data.review_data[header as keyof ReviewData][props.row_number];
        const content = [];
        if (Array.isArray(data_extracted)) {
            for (const data of data_extracted) {
                content.push(<span key={`${props.row_number}${header}${data}`}>{data != data_extracted[data_extracted.length-1] ? `${data},` : data}</span>);
            }
        } else if (typeof data_extracted === "boolean") {
            content.push(data_extracted ? <FaCheckCircle color="#2ecc71" /> : <FaTimesCircle color="#e74c3c" />);
        } else if (header == "Stars" && typeof data_extracted === "number") {
            content.push(<Stars count={data_extracted}/>);
        } else if (header == "Upvotes" && typeof data_extracted === "number") {
            content.push(<span key={`${props.row_number}${header}_`} className="text-[#27ae60] font-semibold">{data_extracted?.toString()}</span>);
        } else if (header == "Downvotes" && typeof data_extracted === "number") {
            content.push(<span key={`${props.row_number}${header}_`} className="text-[#c0392b] font-semibold">{data_extracted?.toString()}</span>);
        } else {
            content.push(<span key={`${props.row_number}${header}_`}>{data_extracted?.toString()}</span>);
        }
        cells.push(<div className="table-cell" key={`${props.row_number}${header}`}>{content}</div>);
    }

    return (
        <div className="table-row">{cells}</div>
    );
}

export default DataRow;