export interface IappConfig {
    api: string;
}
/**
 * 开发环境下的配置
 */
export const web_config_dev: IappConfig = {
    api: "http://test_server_address"
}

export enum EnvEnum {
    PROD = "prod",
    TEST = "test",
    DEV = "dev"
}


