import React from "react";
import { useEffect, useState } from "react";
import { IAppStore, useAppStore } from "../../__internal";

/**
 * 在function组件中使用APP_STORE, 将APP_STORE的数据作为组件state使用
 */
export function FuncComp() {
    let [xx, setXX] = useState(APP_STORE.xx);
    useEffect(() => {
        let handler = (ev: { newValue: any, oldValue: any }) => { setXX(ev.newValue); }
        APP_STORE.on("xxAtt", handler);
        return () => {
            APP_STORE.off("xxAtt", handler)
        }
    });
    return (<div>{xx}</div>)
}


/**
 * 使用提供的帮助函数使用APP_STORE
 */
export function FuncComp2() {
    let storeAtt = useAppStore("xx");
    return (<div>{storeAtt}</div>)
}