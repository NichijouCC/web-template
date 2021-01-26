import { EnvType } from "../__internal";
import { Mystore } from "./mystore";

declare global {
    var APP_VERSION: string;
    var APP_CONFIG: Iappconfig;
    var APP_ENV: EnvType;
    var APP_STORE: Mystore;
};

export interface Iappconfig {
    /**
     * 项目的目标domain
     */
    readonly domain?: string;
    /**
     * 项目的url配置
     */
    readonly api?: string;
}
