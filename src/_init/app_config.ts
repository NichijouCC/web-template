export interface IurlConfig {
    api: string;
}
export interface IappConfig {
    readonly urls?: IurlConfig;
    domain?: string;
}
export type EnvType = "prod" | "test" | "dev";


/**
 * APP的配置
 */
export const app_config: IappConfig = {
    domain: "target_domain"
}