import { AppEnvType } from "../__internal";
import { Mystore } from "./mystore";

declare global {
    /**
     * 项目的配置
     */
    var APP_CONFIG: Iappconfig;
    /**
     * 项目的当前环境
     */
    var APP_ENV: AppEnvType;
    /**
     * 项目的数据中心
     */
    var APP_STORE: Mystore;
};

/**
 * 项目配置的类型配置的example
 */
export interface Iappconfig {
    /**
     * 项目的url配置
     */
    readonly api?: string;
}
