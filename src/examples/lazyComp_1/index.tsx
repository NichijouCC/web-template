import React from "react";
import { LazyComp } from "../../comps/lazyComp";
import { MyApp } from "../../__internal";

function PlayWithLazyComp() {
    return <LazyComp target={() => import('./needLazyLoad')} />
}


MyApp.start(<PlayWithLazyComp />)
