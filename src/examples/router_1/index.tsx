import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Redirect, Route } from 'react-router-dom'
import { MyApp } from "../../__internal";
import Page2 from "./page2";
import { RouterPage } from "./routerPage";

export function AllRoutes() {
    return <Router>
        <Route path="/page1" component={Page2} />
        <Route path="/page" render={() =>
            <RouterPage>
                <Route path="/page2/page3" component={Page2} />
            </RouterPage>} />
        <Route render={() => <Redirect to="/page1" />} />
    </Router>
}

MyApp.start(< AllRoutes />)
