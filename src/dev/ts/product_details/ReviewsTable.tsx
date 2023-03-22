import { Data } from "../product_details";
import HeaderRow from "./HeaderRow";
import DataRow from "./DataRow";

export enum SortDirection {
    Asc,
    Desc,
    None
}

interface ReviewsTableProps {
    data: Data
}

function ReviewsTable(props: ReviewsTableProps) {

    const headers = ["ID", "Username", "Recommended", "Stars", "Trusted", "Time Posted", "Time Bought", "Upvotes", "Downvotes", "Content", "Positives", "Negatives"];

    const dataRows = [];

    const urlparams = new URLSearchParams(window.location.search);

    let field, direction;

    if (urlparams.has("sort")) {
        field = urlparams.get("sort");
        if (urlparams.has("asc")) {
            switch (urlparams.get("asc")) {
                case "0":
                    direction = SortDirection.Desc;
                    break;
                case "1":
                    direction = SortDirection.Asc;
                    break;
                default:
                    direction = SortDirection.None;
            }
        } else {
            direction = SortDirection.Desc;
        }
    } else {
        field = null;
        direction = SortDirection.None;
    }

    const sort = {
        field: field,
        direction: direction
    };

    for (const id of Object.keys(props.data.review_data["ID"])) {
        dataRows.push(<DataRow row_number={+id} key={+id} data={props.data} headers={headers}/>);
    }

    return (
        <div className="flex flex-col h-auto w-full items-center my-16">
            <HeaderRow headers={headers} sort={sort}/>
            {dataRows}
        </div>
    );
}

export default ReviewsTable;