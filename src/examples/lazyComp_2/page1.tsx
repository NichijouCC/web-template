import React from "react";
import { Link } from "react-router-dom";

export default function Page1() {
    return <React.Fragment>
        <div>page1（除了app.bundle,额外加载了bundle）</div>
        <Link to="/page2">跳转page2，注意观察加载 （跳转额外加载了）</Link>
        <div></div>
        <Link to="/page3">跳转page3，注意观察加载。（跳转未额外加载）</Link>
    </React.Fragment>
}