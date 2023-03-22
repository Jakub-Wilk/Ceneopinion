import { ReviewData } from "../common";
import { Data } from "../product_details";

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