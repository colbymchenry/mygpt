const Error = (props: {children: any}) => {
    return <small className="text-red-500">{props.children}</small>
}

Error.displayName = "Error"

export { Error }
