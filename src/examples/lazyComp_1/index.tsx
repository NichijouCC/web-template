import React from "react";
import ReactDOM from "react-dom";
import { initBeforeAppStart } from "@/_init/init";
import { LazyComp } from "../../comps/lazyComp";

initBeforeAppStart();

function PlayWithLazyComp() {
    return <LazyComp target={() => import('./needLazyLoad')} />
}

ReactDOM.render(<PlayWithLazyComp />, document.getElementById("root"));
