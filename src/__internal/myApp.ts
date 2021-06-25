import { ReactElement } from "react";
import ReactDOM from "react-dom";
import { AppStore } from "./appStore";
import { IEnterConfig, IStoreOption } from "./iapp";

/**
 * 项目内置浅封装框架
 */
export class MyApp<K extends object = {}, T extends object = {}> {
    /**
     * APP版本信息
     */
    version: string;

    /**
     * 项目的配置
     */
    config: K;
    /**
     * 项目的当前环境
     */
    env: string;
    /**
     * 项目数据中心
     */
    store: AppStore<{ [P in keyof T]: { newValue: T[P]; oldValue: T[P]; }; }> & T;
    /**
     * 启动项目,
     * @param root 项目组件根节点
     * @param opt 
     */
    private constructor(opt: IEnterConfig<T> = {}) {
        console.info(`版本信息：${APP_VERSION}`);
        Object.defineProperty(global, "APP_STORE_BEDBUG", {
            set: (value) => {
                sessionStorage.setItem("APP_STORE_BEDBUG", value);
            },
            get: () => {
                return sessionStorage.getItem("APP_STORE_BEDBUG")
            }
        })

        let { node_env, app_env, store_opts, app_domain, onInit, private_config } = opt;
        (global as any).NODE_ENV = node_env || public_project_config.node_env || private_config?.node_env || process.env.NODE_ENV || "production";

        //APP_VERSION
        this.version = APP_VERSION;
        (global as any).APP_VERSION = APP_VERSION;

        //APP_ENV
        this.env = app_env || public_project_config.app_env || private_config?.app_env || process.env.APP_ENV || "prod";
        (global as any).APP_ENV = this.env;

        //初始化APP_CONFIG
        this.initAppConfig(opt);

        //初始化APP_STORE
        this.initAppStore(store_opts);

        //修改domain
        if (app_domain) {
            this.initAppDomain(app_domain);
        }
        onInit?.();
    }

    private initAppConfig(config: IEnterConfig) {
        let enter_config = config;
        let public_config = public_project_config.app_config;
        let private_config = config.private_config?.app_config;
        this.config = { ...private_config?.common, ...private_config?.[this.env], ...public_config.common, ...public_config[this.env], ...enter_config };
        (global as any).APP_CONFIG = this.config;
    }

    /**
     * 初始化数据中心
     */
    private initAppStore(opt?: IStoreOption<T>) {
        let _store = AppStore.create(opt);
        this.store = _store as any;
        (global as any).APP_STORE = _store;
        return _store;
    }

    /**
     * 初始化app domain 配置
     */
    private initAppDomain(domain: string) {
        if (domain != null) {
            if (document.domain.indexOf(domain) >= 0) {
                document.domain = domain;
            }
        }
    }

    static start<T extends object = {}>(root: ReactElement, opt?: IEnterConfig<T>) {
        let app = new MyApp(opt);
        ReactDOM.render(root, document.getElementById("root"));
        return app;
    }
}