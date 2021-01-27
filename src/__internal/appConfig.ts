import private_app_config from '../private_app_config.json';

export type AppEnvType = "prod" | "test" | "dev";

/**
 * 初始化APP_CONFIG、APP_ENV、APP_VERSION
 */
export function initAppConfig(app_env?: "prod" | "test" | "dev") {
    global.APP_VERSION = APP_VERSION; //from env+webapck
    let _env = app_env ?? process.env.APP_ENV as AppEnvType;//from env+webapck
    (global as any).APP_ENV = _env;
    switch (_env) {
        case 'dev':
            (global as any).APP_CONFIG = { ...private_app_config.common, ...public_app_config.common, ...private_app_config.dev, ...public_app_config.dev };
            break;
        case "test":
            (global as any).APP_CONFIG = { ...private_app_config.common, ...public_app_config.common, ...private_app_config.test, ...public_app_config.test };
            break;
        case "prod":
        default:
            (global as any).APP_CONFIG = { ...private_app_config.common, ...public_app_config.common, ...private_app_config.prod, ...public_app_config.prod };
    }
}
