import { SortDirection } from "./ReviewsTable";
import { FaSortAmountDown, FaSortAmountUpAlt } from "react-icons/fa";

interface HeaderRowProps {
    headers: Array<string>,
    sort: {
        field: string | null,
        direction: SortDirection
    }
}

function HeaderRow(props: HeaderRowProps) {

    const header_translations = {
        "ID": "ID",
        "Username": "Użytkownik",
        "Recommended": "Poleca",
        "Stars": "Gwiazdki",
        "Trusted": "Zaufana",
        "Time Posted": "Czas recenzji",
        "Time Bought": "Czas kupna",
        "Upvotes": "Głosy +",
        "Downvotes": "Głosy -",
        "Content": "Treść",
        "Positives": "Zalety",
        "Negatives": "Wady"
    };

    const cells = [];

    for (const header of props.headers) {
        let icon = null;
        let alt_direction = "0";
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
        }
        cells.push(
            <a
                className="table-cell"
                key={header}
                href={`${location.pathname}?sort=${header}&asc=${alt_direction}`}
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