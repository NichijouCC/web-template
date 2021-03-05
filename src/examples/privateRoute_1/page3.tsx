import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Page3() {
    return <React.Fragment>
        <div>page3</div>
        <Link to="/page1">跳转page1(检查token)</Link>
        <div></div>
        <Link to="/page2">跳转page2(消除token)</Link>
    </React.Fragment>
}