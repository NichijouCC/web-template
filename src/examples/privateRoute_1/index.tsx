import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Redirect, Route } from 'react-router-dom'
import Page1 from "./page1";
import Page2 from "./page2";
import { CheckTokenRoute } from "../../comps/checkTokenRoute";
import { MyApp } from "../../__internal";

export function AllRoutes() {
    return <Router>
        <CheckTokenRoute path="/page1" component={Page1} />
        <Route path="/page2" component={Page2} />
        <Route render={() => <Redirect to="/page1" />} />
    </Router>
}


MyApp.start(() => {
    ReactDOM.render(< AllRoutes />, document.getElementById("root"));
})
