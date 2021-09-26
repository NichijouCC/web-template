import React, { useRef } from "react";

export function UpdateStore() {
    return (<div>
        <div>--修改APP_STORE值--</div>
        <span>serialize 标记的属性</span>
        <AttChange name="stored_att" />
        <span>share 标记的属性</span>
        <AttChange name="shared_att" />
        <span>无 标记的属性</span>
        <AttChange name="xxAA" />
    </div>)
}

function AttChange(props: { name: string, }) {
    let inputRef = useRef<HTMLInputElement>();
    return <div>{props.name}：<input ref={inputRef} /><button onClick={() => APP_STORE[props.name] = inputRef.current.value}>修改</button></div>
}