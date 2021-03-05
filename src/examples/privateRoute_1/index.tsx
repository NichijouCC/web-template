import React from "react";
import { HashRouter as Router, Redirect, Route } from 'react-router-dom'
import Page1 from "./page1";
import Page2 from "./page2";
import { PrivateRoute } from "../../comps/privateRoute";
import { MyApp } from "../../__internal";
import Page3 from "./page3";
import Login from "./login";

export function AllRoutes() {
    return <Router>
        <PrivateRoute path="/page1" component={Page1} />
        <Route path="/page2" component={Page2} />
        <Route path="/page3" component={Page3} />
        <Route path="/login" component={Login} />
        <Route exact path="/" render={() => <Redirect to="/login" />} />
    </Router>
}


MyApp.start(< AllRoutes />)
