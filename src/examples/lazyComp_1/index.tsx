import React from "react";
import { LazyComp } from "../../comps/lazyComp";
import { MyApp } from "../../__internal";
import '@/config/myStore';

function PlayWithLazyComp() {
    return <div>
        <LazyComp target={() => import('./needLazyLoad')} />
    </div>
}
/**
 * 基本使用 LazyComp演示。       【TIP: lazy的会被分割到另一个bundle】
 */
MyApp.start(<PlayWithLazyComp />)
