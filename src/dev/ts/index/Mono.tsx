interface MonoProps {
    children?: string
}

function Mono(props: MonoProps) {
    return <span className="mono">
        {props.children}
    </span>;
}

export default Mono;