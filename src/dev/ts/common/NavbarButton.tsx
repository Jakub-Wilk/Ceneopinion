import { NavbarOptions } from "./Navbar";

interface NavbarButtonProps {
    destination: NavbarOptions
    current: NavbarOptions
}

function NavbarButton(props: NavbarButtonProps) {

    const is_current = props.destination == props.current;
    let url = "";
    let text = "";

    switch (props.destination) {
        case NavbarOptions.Main:
            url = "/";
            text = "Strona Główna";
            break;
        case NavbarOptions.Extract:
            url = "/product/extract";
            text = "Ekstrakcja";
            break;
        case NavbarOptions.List:
            url = "/product/list";
            text = "Lista produktów";
            break;
        case NavbarOptions.About:
            url = "/about";
            text = "O autorze";
            break;
    }

    return (
        <a href={url} className={is_current ? "navbar-button-selected" : "navbar-button-idle"}>
            {text}
        </a>
    );
}

export default NavbarButton;
