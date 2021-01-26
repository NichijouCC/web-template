import { initAppConfig } from "./appConfig";
import { APPSTORE } from "./appStore";
import { MyApp } from "./myApp";

declare global {
    var APP_VERSION: string;
    var INTERNAL_STORE: APPSTORE
};

/**
 * 初始化
 */
export function internal_init() {
    console.info(`LASTEST APP_VERSION:${APP_VERSION}`);
    //-----------初始化app_config
    initAppConfig();
    //-----------修改domain
    initAppDomain();

    _initList.forEach(item => item())
}


/**
 * 初始化app domain 配置
 */
function initAppDomain() {
    if ((global as any).APP_CONFIG.domain != null) {
        let targetDomain = (global as any).APP_CONFIG.domain;
        if (document.domain.indexOf(targetDomain) >= 0) {
            document.domain = targetDomain;
        }
    }
}

/**
 * 创建一个数据中心
 * @param storeName 
 */
export function MyStore(target: Function) {
    if ((global as any).INTERNAL_STORE != null) {
        throw new Error("can only create one store")
    } else {
        let ctr = target.constructor as any;
        let _store = new APPSTORE(new ctr(), MyApp.storeOption);
        (global as any).INTERNAL_STORE = _store;
        (global as any).APP_STORE = _store.storeIns;
    }
}

var _initList: Function[] = [];
export function initBeforeAppStart(target: Function) {
    _initList.push(target);
}