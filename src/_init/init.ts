import { initAxiosConfig } from "../services/axiosclient";
import { EnvType, IurlConfig, app_config } from "./app_config";
import { GlobalStore } from "./globalStore";

declare global {
    var APP_VERSION: string
};

/**
 * 初始化
 */
export function initBeforeAppStart() {
    console.info(`LASTEST APP_VERSION:${APP_VERSION}`);
    //-----------初始化数据中心
    GlobalStore.init();
    //-----------初始化app_config
    initAppConfig();

    //-----------初始化axios
    initAxiosConfig();

    //-----------修改domain
    initAppDomain();
}

function initAppConfig() {
    Object.defineProperty(app_config, "urls", {
        get(): IurlConfig {
            switch (process.env.APP_ENV as EnvType) {
                case 'dev':
                    return url_config.dev;
                case "test":
                    return url_config.test;
                case "prod":
                default:
                    return url_config.prod;
            }
        }
    })
    GlobalStore.APP_CONFIG = app_config;
}

function initAppDomain() {
    if (GlobalStore.APP_CONFIG.domain != null) {
        let targetDomain = GlobalStore.APP_CONFIG.domain;
        if (document.domain.indexOf(targetDomain) >= 0) {
            document.domain = targetDomain;
        }
    }
}
