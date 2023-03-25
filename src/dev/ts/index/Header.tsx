interface HeaderProps {
    children?: JSX.Element[] | JSX.Element | string
}

function Header(props: HeaderProps) {
    return <div className="text-2xl my-4">
        {props.children}
    </div>;
}

export default Header;