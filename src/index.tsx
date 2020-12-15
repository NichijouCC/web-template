import React from "react";
import ReactDOM from "react-dom";
import { APP } from "./app";

ReactDOM.render(<APP />, document.getElementById("root"));

console.info(`latest version:${VERSION}`);
declare global {
    const VERSION: string;
}
