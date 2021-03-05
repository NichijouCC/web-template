import React, { useRef } from "react";

export function UpdateStore() {
    return (<div>
        修改APP_STORE值：
        <AttChange name="xxAtt" />
        <AttChange name="xxAA" />
    </div>)
}

function AttChange(props: { name: string, }) {
    let inputRef = useRef<HTMLInputElement>();
    return <div>{props.name}：<input ref={inputRef} /><button onClick={() => APP_STORE[props.name] = inputRef.current.value}>修改</button></div>
}