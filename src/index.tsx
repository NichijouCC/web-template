import React from "react";
import { APP } from "./app";
import { initAxiosConfig } from "./extends/axios";
import { MyApp } from "./__internal";

MyApp.start(<APP />, {
    onInit: () => initAxiosConfig()
});