import React from "react";
import { Link } from "react-router-dom";

export default function Page2() {
    return <React.Fragment>
        <div>page2（额外加载bundle）</div>
        <Link to="/page1">跳转page1</Link>
        <div></div>
        <Link to="/page3">跳转page3</Link>
    </React.Fragment>
}