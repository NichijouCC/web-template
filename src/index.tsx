import React from "react";
import ReactDOM from "react-dom";
import { APP } from "./app";
import { initAxiosConfig } from "./services/axiosclient";
import { MyApp } from "./__internal";

MyApp.start(() => {

    initAxiosConfig();

    ReactDOM.render(<APP />, document.getElementById("root"));
});