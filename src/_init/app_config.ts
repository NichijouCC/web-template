export interface IurlConfig {
    api: string;
}
export interface IappConfig {
    readonly current_url_config?: IurlConfig;
    domain?: string;
    dev_url_config: IurlConfig;
}

/**
 * 开发环境下的配置
 */
export const app_config: IappConfig = {
    domain: "target_domain",
    dev_url_config: {
        api: "http://test_server_address"
    },
}

export type EnvType = "prod" | "test" | "dev";

