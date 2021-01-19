import { EnvType } from "../__internal";
import { Mystore } from "./mystore";

declare global {
    var APP_VERSION: string;
    var APP_CONFIG: Iappconfig;
    var APP_ENV: EnvType;
    var APP_STORE: Mystore;
};

export interface Iappconfig {
    api?: string;
}


