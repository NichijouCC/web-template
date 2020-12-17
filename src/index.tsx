import React from "react";
import ReactDOM from "react-dom";
import { APP } from "./app";
import { initBeforeAppStart } from "./init/init";

initBeforeAppStart();

ReactDOM.render(<APP />, document.getElementById("root"));

