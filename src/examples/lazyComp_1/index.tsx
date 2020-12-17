import React from "react";
import ReactDOM from "react-dom";
import { initBeforeAppStart } from "@/init/init";
import { LazyComp } from "../../comps/lazyComp";

initBeforeAppStart();

function PlayWithLazyComp() {
    return <LazyComp target={() => import('./lazycomp')} />
}

ReactDOM.render(<PlayWithLazyComp />, document.getElementById("root"));
