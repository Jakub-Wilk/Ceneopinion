import { SortDirection } from "./ReviewsTable";
import { FaMinusCircle, FaPlusCircle, FaSortAmountDown, FaSortAmountUpAlt } from "react-icons/fa";

interface HeaderRowProps {
    headers: Array<string>,
    sort: {
        field: string | null,
        direction: SortDirection
    }
}

function HeaderRow(props: HeaderRowProps) {

    const header_translations = {
        "id": "id",
        "username": "Użytkownik",
        "recommended": "Poleca",
        "Stars": "Gwiazdki",
        "trusted": "Zaufana",
        "time_posted": "Czas recenzji",
        "time_bought": "Czas kupna",
        "upvotes": <>{"Głosy "}<FaPlusCircle className="translate-y-0.5" color="#27ae60" /></>,
        "downvotes": <>{"Głosy "}<FaMinusCircle className="translate-y-0.5" color="#c0392b" /></>,
        "content": "Treść",
        "positives": "Zalety",
        "negatives": "Wady"
    };

    const get_href = (header: string, alt_direction: string) => {
        const urlparams = new URLSearchParams(location.search);
        urlparams.set("sort", header);
        urlparams.set("asc", alt_direction);
        return `${location.pathname}?${urlparams.toString()}`;
    };

    const cells = [];

    for (const header of props.headers) {
        let icon = null;
        let alt_direction = "0";
        let selected = "";
        if (header == props.sort.field && props.sort.direction != SortDirection.None) {
            switch (props.sort.direction) {
                case SortDirection.Asc:
                    icon = <FaSortAmountUpAlt />;
                    alt_direction = "0";
                    break;
                case SortDirection.Desc:
                    icon = <FaSortAmountDown />;
                    alt_direction = "1";
                    break;
            }
            selected = "header-selected";
        }
        cells.push(
            <a
                className={`table-cell ${selected}`}
                key={header}
                href={get_href(header, alt_direction)}
            >
                {header_translations[header as keyof typeof header_translations]}{icon}
            </a>
        );
    }

    return (
        <div className="table-row sticky top-0 bg-white">{cells}</div>
    );
}

export default HeaderRow;