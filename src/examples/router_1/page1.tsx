import React from "react";
import { Link } from "react-router-dom";

export default function Page1() {
    return <React.Fragment>
        <div>page1</div>
        <Link to="/page2">跳转page2</Link>
    </React.Fragment>
}