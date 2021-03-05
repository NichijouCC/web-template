import React from "react";
import { MyApp } from "../../__internal";
import { ClassComp, ClassComp2 } from "./classComp";
import { FuncComp, FuncComp2 } from "./funcComp";

MyApp.start(
    (
        <div>
            <ClassComp />
            <ClassComp2 />
            <FuncComp />
            <FuncComp2 />
        </div >
    )
);
