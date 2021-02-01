import { ReactElement } from "react";
import ReactDOM from "react-dom";
import { AppStore } from "./appStore";
import { AppEnvType, IappStartOption, IstoreOption } from "./iapp";
import private_config from '@/private_app_config.json'
import { EventEmitter } from "@mtgoo/ctool";

/**
 * 项目内置浅封装框架
 */
export class MyApp<K extends object = {}, T extends object = {}> {
    /**
     * APP版本信息
     */
    appversion: string;

    /**
     * 项目的配置
     */
    appconfig: K;
    /**
     * 项目的当前环境
     */
    appenv: AppEnvType;
    /**
     * 项目数据中心
     */
    appDataCenter: AppStore<{ [P in keyof T]: { newValue: T[P]; oldValue: T[P]; }; }> & T;
    /**
     * 项目事件中心
     */
    appEventCenter: EventEmitter<IdataEvents>;

    /**
     * 启动项目,
     * @param root 项目组件根节点
     * @param opt 
     */
    private constructor(opt?: IappStartOption<T>) {
        console.info(`版本信息：${APP_VERSION}`);
        let { app_env, app_config: app_configs, store_data: datacenter_data, store_opt: datacenter_opt, app_domain, onInit } = opt || {};
        //--------------------APP_VERSION
        this.appversion = APP_VERSION;
        (global as any).APP_VERSION = APP_VERSION;
        //--------------------APP_ENV
        this.appenv = app_env || process.env.APP_ENV || "prod" as any;
        (global as any).APP_ENV = this.appenv;
        //--------------------APP_CONFIG
        this.initConfig(app_configs);
        //-----------初始化APP_STORE
        let datacenter = datacenter_data ?? (_datacenter_target ? new (_datacenter_target as any)() : {})
        this.initAppStore(datacenter as any, datacenter_opt);
        //-----------初始化APP_EVENTCENTER
        this.appEventCenter = new EventEmitter<IdataEvents>();
        //-----------修改domain
        if (app_domain) {
            this.initAppDomain(app_domain);
        }

        onInit?.();
    }

    private initConfig(config: Partial<IappConfig>) {
        switch (this.appenv) {
            case 'dev':
                this.appconfig = { ...private_config.common, ...public_app_config.common, ...private_config.dev, ...public_app_config.dev, ...config } as K;
                break;
            case "test":
                this.appconfig = { ...private_config.common, ...public_app_config.common, ...private_config.test, ...public_app_config.test, ...config } as K;
            case "prod":
            default:
                this.appconfig = { ...private_config.common, ...public_app_config.common, ...private_config.prod, ...public_app_config.prod, ...config } as K;
        }
        (global as any).APP_CONFIG = this.appconfig;
    }

    /**
     * 初始化数据中心
     */
    private initAppStore(data: T, opt?: IstoreOption) {
        let _store = AppStore.create(data, opt);
        this.appDataCenter = _store;
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

    static start<T extends object = {}>(root: ReactElement, opt?: IappStartOption<T>) {
        let app = new MyApp(opt);
        ReactDOM.render(root, document.getElementById("root"));
        return app;
    }
}

var _datacenter_target: new () => any;
export function MyStore(target: Function) {
    _datacenter_target = target as any;
}