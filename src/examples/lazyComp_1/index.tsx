import React from "react";
import ReactDOM from "react-dom";
import { LazyComp } from "../../comps/lazyComp";
import { MyApp } from "../../__internal";

function PlayWithLazyComp() {
    return <LazyComp target={() => import('./needLazyLoad')} />
}


MyApp.start(() => {
    ReactDOM.render(<PlayWithLazyComp />, document.getElementById("root"));
})
