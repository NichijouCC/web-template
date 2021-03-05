import React from "react";
import { useEffect, useState } from "react";
import { IAppStore, useAppStore } from "../../__internal";

/**
 * 在function组件中使用APP_STORE, 将APP_STORE的数据作为组件state使用
 */
export function FuncComp() {
    let [xxAA, setXXAA] = useState(APP_STORE.xxAA);
    useEffect(() => {
        let handler = (ev: { newValue: any, oldValue: any }) => { setXXAA(ev.newValue); }
        APP_STORE.on("xxAA", handler);
        return () => {
            APP_STORE.off("xxAA", handler)
        }
    });
    return <div>【FuncComp】xxAA:{xxAA}</div>
}


/**
 * 使用提供的帮助函数使用APP_STORE
 */
export function FuncComp2() {
    let storeAtt = useAppStore("xxAA");
    return <div>【FuncComp2】xxAA:{storeAtt}</div>
}