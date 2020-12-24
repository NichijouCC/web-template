import { initAxiosConfig } from "../services/axiosclient";
import { EnvType, IurlConfig, app_config } from "./app_config";
import { GlobalStore } from "./globalStore";

declare global {
    var APP_VERSION: string
    /**
     * 配置文件（public/url_config.js）
     */
    var url_config: {
        test: IurlConfig,
        prod: IurlConfig,
    }
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
                    return app_config.dev_url_config;
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
