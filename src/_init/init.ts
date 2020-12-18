import { EnvEnum, IappConfig, web_config_dev } from "./app_config";
import { GlobalStore } from "./globalStore";

declare global {
    var APP_VERSION: string
    /**
     * 配置文件（public/web_config.js）
     */
    var web_config: {
        test: IappConfig,
        prod: IappConfig,
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
    switch (process.env.APP_ENV) {
        case EnvEnum.DEV:
            GlobalStore.APP_CONFIG = web_config_dev;
            break;
        case EnvEnum.TEST:
            GlobalStore.APP_CONFIG = web_config.test;
            break;
        case EnvEnum.PROD:
        default:
            GlobalStore.APP_CONFIG = web_config.prod;
    }
}
