import React from "react";
import { Link } from "react-router-dom";

export default function Page1() {
    return <React.Fragment>
        <div>page1(检查token)</div>
        <Link to="/page2">跳转page2(消除token)</Link>
        <div></div>
        <Link to="/page3">跳转page3</Link>
    </React.Fragment>
}