import React from "react";
import { MyApp } from "../../__internal";
import { ClassComp, ClassComp2 } from "./classComp";
import { FuncComp, FuncComp2 } from "./funcComp";
import { UpdateStore } from "./updateStore";

MyApp.start(
    (
        <div>//----------------------------------------<br></br>
            //<br></br>
            //-------------APP_STORE演示----------<br></br>
            //<br></br>
            //-----------------------------------------<br></br>
            <UpdateStore />
            <div>--------------------------</div>
            <ClassComp />
            <ClassComp2 />
            <FuncComp />
            <FuncComp2 />
        </div >
    )
);
