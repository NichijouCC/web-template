import React from "react";
import { APP } from "./app";
import { initAxiosConfig } from "./extends/axios";
import { MyApp } from "./__internal";
/**
 * ** 如果使用CustomStore, 这句别删 **
 */
import './config/customStore';

MyApp.start(<APP />, {
    onInit: () => initAxiosConfig()
});