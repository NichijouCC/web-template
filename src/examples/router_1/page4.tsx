import React from "react";
import { Link } from "react-router-dom";

export default function Page4() {
    return <React.Fragment>
        <div>page2子界面：2</div>
        <Link to="/page2/page3">跳转page2_1</Link>
    </React.Fragment>
}