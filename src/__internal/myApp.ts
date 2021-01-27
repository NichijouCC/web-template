import { ReactElement } from "react";
import ReactDOM from "react-dom";
import { AppEnvType, initAppConfig } from "./appConfig";
import { initAppDomain } from "./appFunc";
import { initAppStore, IstoreOption } from "./appStore";
/**
 * 项目可选配置
 */
export interface IappOption {
    /**
     * domain改写
     */
    domain?: string;
    /**
     * 覆盖掉默认环境配置
     */
    app_env?: AppEnvType;
    /**
     * 数据中心配置项
     */
    storeOpt?: IstoreOption
    /**
     * 启动的时候干些事情
     */
    onInit?: () => void;
}

/**
 * 项目内置浅封装框架
 */
export class MyApp {

    private static _opt: IappOption;
    /**
     * 数据中心配置
     */
    static get storeOption() { return this._opt?.storeOpt };

    /**
     * 启动项目,
     * @param root 项目组件根节点
     * @param opt 
     */
    static start = (root: ReactElement, opt?: IappOption) => {
        MyApp._opt = opt;
        console.info(`版本信息：${APP_VERSION}`);
        //-----------初始化APP_CONFIG
        initAppConfig(opt?.app_env);
        //-----------初始化APP_STORE
        initAppStore(opt?.storeOpt);
        //-----------修改domain
        initAppDomain(opt?.domain);

        opt.onInit?.();
        ReactDOM.render(root, document.getElementById("root"));
    }
}