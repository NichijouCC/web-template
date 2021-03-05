import React from "react";
import { Link } from "react-router-dom";

export default function Page3() {
    return <React.Fragment>
        <div>page2子界面：1</div>
        <Link to="/page2/page4">跳转page2_2</Link>
    </React.Fragment>
}