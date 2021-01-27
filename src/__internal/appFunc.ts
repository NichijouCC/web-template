import { APPSTORE } from "./appStore";

declare global {
    /**
     * APP版本信息
     */
    var APP_VERSION: string;
    /**
     * 內部数据中心
     */
    var INTERNAL_STORE: APPSTORE
};

/**
 * 初始化app domain 配置
 */
export function initAppDomain(domain: string) {
    if (domain != null) {
        if (document.domain.indexOf(domain) >= 0) {
            document.domain = domain;
        }
    }
}