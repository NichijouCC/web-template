export interface IappConfig {
    api: string;
}
/**
 * 开发环境下的配置
 */
export const web_config_dev: IappConfig = {
    api: "http://test_server_address"
}

/**
 * 初始化web 配置
 */
export function init_App_config() {
    switch (process.env.APP_ENV) {
        case EnvEnum.DEV:
            APP_CONFIG = web_config_dev;
            break;
        case EnvEnum.TEST:
            APP_CONFIG = web_config.test;
            break;
        case EnvEnum.PROD:
        default:
            APP_CONFIG = web_config.prod;
    }
}

export enum EnvEnum {
    PROD = "prod",
    TEST = "test",
    DEV = "dev"
}


