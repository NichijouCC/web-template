import React from "react";
import { LazyComp } from "../comps/lazyComp";

export function test() {
    return <LazyComp target={() => import("./main")} />
}