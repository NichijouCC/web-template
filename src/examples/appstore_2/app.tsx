import { Modal } from "antd";
import React from "react";
import { useAppStore } from "../../__internal/index";
import { GlobalConfirmBox } from "./globalConfirmBox";
import { PageComp1 } from "./pageComp1";
import { PageComp2 } from "./pageComp2";

export function App() {
    return <React.Fragment>
        <GlobalConfirmBox />
        <PageComp1 />
        <PageComp2 />
    </React.Fragment>
}