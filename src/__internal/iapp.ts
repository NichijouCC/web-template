import { AppStore, IStoreEvents } from "./appStore";

declare global {
    /**
     * node环境，默认：production
     */
    var NODE_ENV: "production" | "development";
    /**
     * 项目环境, 默认：prod
     */
    var APP_ENV: string;
    /**
     * 项目版本
     */
    var APP_VERSION: string;
    /**
     * 项目的配置
     */
    var APP_CONFIG: IAppConfig;
    /**
     * 项目的数据中心
     */
    var APP_STORE: IAppStore;
    /**
     * 是否开启APP_STORE的debug模式
     */
    var APP_STORE_BEDBUG: boolean;

    /**
     * 项目配置
     */
    interface IProjectConfig {
        node_env?: "production" | "development";
        app_env?: string;
        app_config?: { common: Partial<IAppConfig> } & { [env: string]: Partial<IAppConfig> }
    }

    /**
     * app_config配置
     */
    interface IAppConfig {
        [k: string]: any
    }
    /**
     * 事件中心的事件类型定义
     */
    interface IDataEvents {
        [k: string]: any
    }
    /**
     * 数据中心的类型定义
     */
    interface IStoreData { [key: string]: any; }
}

export type IAppStore = IStoreData & AppStore<IStoreEvents<IStoreData>>;

// export type AppEnvType = "prod" | "test" | "dev" | string;

export interface IAppConfigs<T = IAppConfig> {
    common?: Partial<T>,
    dev?: Partial<T>,
    test?: Partial<T>,
    prod?: Partial<T>,
}

/**
 * app_store 配置项
 */
export interface IStoreOption<T extends object> {
    /**
     * 目标对象;如果为null,即为@MyStore 标记的对象
     */
    target?: T;
    /**
     * store初始化值
     */
    initData?: Partial<T>;
    /**
     * 是否将数据存入Storage，默认：“none”
     */
    saveItemToStorage?: "localStorage" | "sessionStorage" | "none";
    /**
     * 启动的时候加载上次的数据，默认：true
     */
    loadDataOnOpen?: boolean;
}

/**
 * 项目可选配置
 */
export interface IEnterConfig<T extends object = {}> {
    node_env?: string;
    /**
     * 覆盖掉默认环境配置
     */
    app_env?: string;
    /**
     * merge掉 privateConfig和publicConfig
     */
    app_config?: Partial<IAppConfig>;
    /**
     * 数据中心 - 配置项
     */
    store_opts?: IStoreOption<T>,
    /**
     * domain改写
     */
    app_domain?: string;

    /**
     * 启动的时候干些事情
     */
    onInit?: () => void;

    private_config?: IProjectConfig;
}