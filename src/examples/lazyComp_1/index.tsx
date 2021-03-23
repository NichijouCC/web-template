import React from "react";
import { LazyComp } from "../../comps/lazyComp";
import { MyApp } from "../../__internal";
import '@/config/customStore';

function PlayWithLazyComp() {
    return <div>
        基本使用 LazyComp演示。       【TIP: lazy的会被分割到另一个bundle】
        <LazyComp target={() => import('./needLazyLoad')} />
    </div>
}

MyApp.start(<PlayWithLazyComp />)
