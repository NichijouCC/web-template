import React from "react";
import ReactDOM from "react-dom";
import { APP } from "./app";
import { initBeforeAppStart } from "./_init/init";

initBeforeAppStart();

ReactDOM.render(<APP />, document.getElementById("root"));