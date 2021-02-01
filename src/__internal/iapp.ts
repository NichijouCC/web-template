import { EventEmitter } from "@mtgoo/ctool";
import { AppStore, IstoreEvents } from "./appStore";

declare global {
    /**
     * 项目环境
     */
    var APP_ENV: AppEnvType;
    /**
     * 项目版本
     */
    var APP_VERSION: string;
    /**
     * 项目的配置
     */
    var APP_CONFIG: IappConfig;
    /**
     * 项目的数据中心
     */
    var APP_STORE: IdataStruct & AppStore<IstoreEvents<IdataStruct>>;

    /**
     * 项目配置
     */
    interface IappConfig {
        [k: string]: any
    }
    /**
     * 事件中心的事件类型定义
     */
    interface IdataEvents {
        [k: string]: any
    }
    /**
     * 数据中心的类型定义
     */
    interface IdataStruct { }
}

export type AppEnvType = "prod" | "test" | "dev";

export interface IappConfigs<T = IappConfig> {
    common?: Partial<T>,
    dev?: Partial<T>,
    test?: Partial<T>,
    prod?: Partial<T>,
}

/**
 * app_store 配置项
 */
export interface IstoreOption {
    /**
     * 是否将数据存入Storage，默认：“none”
     */
    saveItemToStorage?: "localStorage" | "sessionstorage" | "none";
    /**
     * 启动的时候加载上次的数据，默认：true
     */
    loadDataOnOpen?: boolean;
}

/**
 * 项目可选配置
 */
export interface IappStartOption<T extends object = {}> {
    /**
     * 覆盖掉默认环境配置
     */
    app_env?: AppEnvType;
    /**
     * merge掉 privateconfig和publicconfig
     */
    app_config?: Partial<IappConfig>;
    /**
     * 数据中心 - 存储的数据
     */
    store_data?: T,
    /**
     * 数据中心 - 配置项
     */
    store_opt?: {
        saveItemToStorage?: "localStorage" | "sessionstorage" | "none";
        loadDataOnOpen?: boolean;
    },
    /**
     * domain改写
     */
    app_domain?: string;

    /**
     * 启动的时候干些事情
     */
    onInit?: () => void;
}

export type IappStore<T, K> = T & EventEmitter<K>;