import React from "react";
import { Link } from "react-router-dom";

export default function Page3() {
    return <React.Fragment>
        <div>page3（无额外bundle加载）</div>
        <Link to="/page1">跳转page1</Link>
        <div></div>
        <Link to="/page2">跳转page2</Link>
    </React.Fragment>
}