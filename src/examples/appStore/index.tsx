import React from "react";
import { MyApp } from "../../__internal/index";
import { ClassComp, ClassComp2 } from "./classComp";
import { FuncComp, FuncComp2 } from "./funcComp";
import { UpdateStore } from "./updateStore";
import '@/config/myStore';

/**
 * APP_STORE使用演示
 */
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
            <button onClick={() => window.open(window.location.href)} >开新界面</button>
        </div >
    )
);
