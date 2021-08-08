import React from "react";
import { MyApp } from "../../__internal/index";
import '@/config/myStore';

import 'antd/dist/antd.css';
import { App } from "./app";

/**
 * 演示权限组件
 */
MyApp.start(<App />)
