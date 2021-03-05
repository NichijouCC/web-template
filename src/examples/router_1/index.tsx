import React from "react";
import { HashRouter as Router, Redirect, Route } from 'react-router-dom'
import { MyApp } from "../../__internal";
import Page1 from "./page1";
import Page3 from "./page3";
import Page4 from "./page4";
import { RouterPage } from "./routerPage";

export function AllRoutes() {
    return <Router>
        <Route path="/page1" component={Page1} />
        <Route path="/page2" render={() =>
            <RouterPage>
                <Route path="/page2/page3" component={Page3} />
                <Route path="/page2/page4" component={Page4} />
                <Route exact path="/page2" render={() => <Redirect to="/page2/page3" />} />
            </RouterPage>} />
        <Route exact path="/" render={() => <Redirect to="/page1" />} />
    </Router>
}

MyApp.start(< AllRoutes />)
