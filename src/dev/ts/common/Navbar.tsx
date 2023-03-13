import NavbarButton from "./NavbarButton";

export enum NavbarOptions {
    Main,
    Extract,
    List,
    About
}

interface NavbarProps {
    selected: NavbarOptions
}

function Navbar(props: NavbarProps) {
    return (
        <div className="h-20 w-full flex border-b-ceneo border-b-2 select-none">
            <img src="/static/assets/Logo.png" className="h-full ml-4"></img>
            <div className="w-full flex justify-end items-center">
                <NavbarButton destination={NavbarOptions.Main} current={props.selected}/>
                <NavbarButton destination={NavbarOptions.Extract} current={props.selected}/>
                <NavbarButton destination={NavbarOptions.List} current={props.selected}/>
                <NavbarButton destination={NavbarOptions.About} current={props.selected}/>
            </div>
        </div>
    );
}

export default Navbar;

