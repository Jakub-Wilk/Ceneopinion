interface ContentProps {
    children?: (JSX.Element | string)[] | JSX.Element | string
}

function Content(props: ContentProps) {
    return <div className="text-lg mb-4 content">
        {props.children}
    </div>;
}

export default Content;