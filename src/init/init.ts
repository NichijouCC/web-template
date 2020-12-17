import { EnvEnum, IappConfig, init_App_config } from "./app_config";
import { GlobalStore } from "./globalStore";

declare global {
    /**
     * 当前的开发环境
     */
    var APP_ENV: EnvEnum;
    /**
     * 当前版本时间
     */
    var APP_VERSION: string;
    /**
     * 当前使用的配置
     */
    var APP_CONFIG: IappConfig
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
    init_App_config();
    GlobalStore.init();
}
