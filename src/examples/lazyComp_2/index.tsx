import React from "react";
import ReactDOM from "react-dom";
import { initBeforeAppStart } from "@/_init/init";
import { LazyComp } from "../../comps/lazyComp";
import { HashRouter as Router, Redirect, Route } from 'react-router-dom'
import Page2 from "./page2";

initBeforeAppStart();

export function AllRoutes() {
    return <Router>
        <Route path="/page1" render={() => <LazyComp target={() => import("./page1")} />} />
        <Route path="/page2" component={Page2} />
        <Route render={() => <Redirect to="/page1" />} />
    </Router>
}

ReactDOM.render(< AllRoutes />, document.getElementById("root"));
