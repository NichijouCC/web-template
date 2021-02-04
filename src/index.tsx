import React from "react";
import { APP } from "./app";
import { initAxiosConfig } from "./services/axiosClient";
import { MyApp } from "./__internal";

MyApp.start(<APP />, {
    onInit: () => initAxiosConfig()
});