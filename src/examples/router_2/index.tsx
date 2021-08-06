import React from "react";
import { HashRouter as Router } from 'react-router-dom'
import { MyApp } from "../../__internal/index";
import '@/config/myStore';

import 'antd/dist/antd.css';

import { IMenuRouteElementProps, MenuForRoute, RouteForMenu } from "@/comps/menuRoute";
import Page1 from "./page1";
import Page2_1 from "./page2_1";

/**
 * 自行配置menu组件怎么摆放
 */
export function MenuParentPage() {
    return <div style={{ width: "100%", display: "flex", flexDirection: "row" }}>
        <div className="left">
            <MenuForRoute menus={menuRoutConfig} theme="dark" style={{ width: 200 }} mode="inline" />
        </div>
        <div className="right-container">
            <RouteForMenu menus={menuRoutConfig} />
        </div>
    </div>
}


export function AllRoutes() {
    return <Router>
        <MenuParentPage />
    </Router>
}

const menuRoutConfig: IMenuRouteElementProps[] = [
    {
        key: "目录1",
        title: "目录1",
        path: "/page1",
        component: Page1,
    },
    {
        key: "目录2",
        title: "目录2",
        path: "/page2",
        children: [
            {
                key: "目录2-1",
                title: "目录2-1",
                path: "/page2/Page2_1",
                component: Page2_1,
            }
        ]
    }
]

/**
 * 演示集中配置多级路由
 */
MyApp.start(< AllRoutes />)
