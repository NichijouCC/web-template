import React from "react";
import { MyApp } from "../../__internal";
import { ClassComp, ClassComp2 } from "./classComp";
import { FuncComp, FuncComp2 } from "./funcComp";
import { UpdateStore } from "./updateStore";

MyApp.start(
    (
        <div>APP_STORE演示
            <UpdateStore />
            <div>--------------------------</div>
            <ClassComp />
            <ClassComp2 />
            <FuncComp />
            <FuncComp2 />
        </div >
    )
);
